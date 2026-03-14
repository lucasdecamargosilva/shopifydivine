# Tray Auto-Install Integration — Design Spec

## Objetivo

Automatizar a instalacao do script do Provador Virtual ("Provou Levou") em lojas Tray. Quando um lojista instala o app "Provou Levou" na Tray, o sistema deve automaticamente:

1. Obter credenciais de acesso (OAuth)
2. Gerar uma API key unica para a loja
3. Injetar o script do provador virtual na loja
4. Registrar a loja no banco de dados

Sem intervencao manual.

---

## Arquitetura

### Componentes

| Componente | Onde roda | Funcao |
|---|---|---|
| Workflow N8N "Tray Install" | n8n.segredosdodrop.com | Recebe callback, autentica, gera key, injeta script |
| `provador-tray.js` | lojista.provoulevou.com.br (EasyPanel) | Script generico do provador virtual para lojas Tray |
| Tabela `provou_levou_stores` | Postgres (existente) | Armazena dados das lojas, API keys, tokens |

### Diagrama de Fluxo

```
Lojista clica "Instalar" na Tray
        |
        v
Tray redireciona para callback URL (N8N webhook)
com: code, api_address, store_host
        |
        v
N8N troca o code por access_token + refresh_token
(POST {api_address}/auth)
        |
        v
N8N gera uma API key unica (pl_live_...)
        |
        v
N8N salva na tabela provou_levou_stores:
  domain, api_key_hash, access_token, refresh_token,
  token_expiration, store_id, api_address, status
        |
        v
N8N injeta o script do provador na loja
(POST {api_address}/scripts?access_token=...)
source: https://lojista.provoulevou.com.br/provador-tray.js?key=pl_live_xxx
        |
        v
N8N retorna pagina HTML de sucesso ao lojista
```

---

## Componente 1: Workflow N8N — "Tray Install"

### Webhook (GET)

- Path: `/webhook/tray-install`
- URL completa: `https://n8n.segredosdodrop.com/webhook/tray-install`
- Parametros recebidos da Tray via query string:
  - `code` — codigo de autorizacao
  - `api_address` — endereco da API da loja (ex: `loja123.tray.com.br/web_api`)
  - `store` — ID da loja
  - `store_host` — dominio da loja

### Node 1: HTTP Request — Trocar code por tokens

```
POST https://{api_address}/auth
Content-Type: application/x-www-form-urlencoded

consumer_key=2186aed7c9bd75669c578f1410ca5ae27db90a019dad66bcc408cb5c2cd8b471
consumer_secret=670a29ee17a01e3b59ae98e7f8c7040ee5d9218ae8be2a5787a3b47fa7d436da
code={code}
```

Resposta esperada:
```json
{
  "access_token": "xxxxx",
  "refresh_token": "xxxxx",
  "date_expiration_access_token": "2026-04-14 00:00:00",
  "date_expiration_refresh_token": "2026-05-14 00:00:00",
  "store_id": "12345",
  "api_host": "https://loja.tray.com.br/web_api"
}
```

### Node 2: Crypto — Gerar API Key

- Gerar string aleatoria de 64 caracteres hex
- Prefixar com `pl_live_`
- Resultado: `pl_live_<64 hex chars>`

### Node 3: Crypto — Hash da API Key

- Algoritmo: SHA256 (mesmo usado no workflow Quantic Materialize existente)
- Input: a API key gerada
- Output: hash para armazenar no banco

### Node 4: Postgres INSERT — Salvar loja

Tabela: `provou_levou_stores`

Campos a inserir:
- `domain` — dominio da loja (store_host, com `https://` prefixado)
- `api_key_hash` — hash SHA256 da API key
- `status` — "Teste Gratuito"
- `access_token` — token de acesso da Tray (novo campo)
- `refresh_token` — token de refresh da Tray (novo campo)
- `token_expiration` — data de expiracao do access_token (novo campo)
- `store_id` — ID da loja na Tray (novo campo)
- `api_address` — endereco da API da loja (novo campo)
- `platform` — "tray" (novo campo)

### Node 5: HTTP Request — Injetar script na loja

```
POST https://{api_address}/scripts?access_token={access_token}
Content-Type: application/json

{
  "ExternalScript": {
    "source": "https://lojista.provoulevou.com.br/provador-tray.js?key={api_key}"
  }
}
```

### Node 6: Respond to Webhook — Pagina de sucesso

Retornar HTML simples confirmando a instalacao:
```html
<h1>Provou Levou instalado com sucesso!</h1>
<p>O provador virtual ja esta ativo na sua loja.</p>
```

---

## Componente 2: Script `provador-tray.js`

### Base

Copia do `Mariana Cardoso/provador-v3.js` com uma unica alteracao: a API key e lida dinamicamente da URL do script em vez de ser hardcoded.

### Alteracao

```js
// ANTES (hardcoded):
const apiKey = "pl_live_718051120233d...";

// DEPOIS (dinamico):
const scriptTag = document.querySelector('script[src*="provador-tray"]');
const apiKey = new URL(scriptTag.src).searchParams.get('key');
```

### Hospedagem

- Servidor: EasyPanel em `72.61.128.136:3000`
- Dominio: `lojista.provoulevou.com.br`
- Servido como arquivo estatico via Nginx ou Caddy
- HTTPS obrigatorio (Tray exige)

### Conteudo mantido do provador-v3.js

- Tabelas de tamanhos (SIZES_TOP, SIZES_BOTTOM, GRADE)
- Deteccao de produto por nome (detectProduct)
- Calculo de medidas (estimarTorax, estimarQuadril)
- Modal do provador virtual (UI completa)
- Upload de foto e envio para webhook N8N
- Logo e branding configurados

---

## Componente 3: Banco de Dados

### Novas colunas na tabela `provou_levou_stores`

| Coluna | Tipo | Descricao |
|---|---|---|
| `access_token` | TEXT | Token de acesso da Tray |
| `refresh_token` | TEXT | Token de refresh da Tray |
| `token_expiration` | TIMESTAMP | Expiracao do access_token |
| `store_id` | VARCHAR | ID da loja na Tray |
| `api_address` | TEXT | Endereco da API da loja |
| `platform` | VARCHAR | Plataforma ("tray", "shopify", "nuvemshop") |

Essas colunas permitem renovar tokens e gerenciar lojas futuramente.

---

## Credenciais da Integracao Tray

- **Consumer Key:** `2186aed7c9bd75669c578f1410ca5ae27db90a019dad66bcc408cb5c2cd8b471`
- **Consumer Secret:** `670a29ee17a01e3b59ae98e7f8c7040ee5d9218ae8be2a5787a3b47fa7d436da`
- **Callback URL:** `https://n8n.segredosdodrop.com/webhook/tray-install`

---

## Limites e Restricoes

- **Rate limit Tray:** 180 requisicoes/minuto, 10.000/dia por loja
- **OAuth tokens expiram:** access_token expira (tipicamente 30 dias), refresh_token tambem
- **Script injection:** O `POST /scripts` injeta o script em todas as paginas da loja (nao ha filtro por pagina na API da Tray)
- **HTTPS obrigatorio:** O source do script deve ser HTTPS

---

## Fluxo de Teste

1. Acessar loja de teste: `https://loja-s.tray.com.br/adm/login.php?loja=1225878`
2. Login: `lcamargo@quanticsolutions.com.br` / `Trayteste@321`
3. Ir em Aplicativos > Instalar novos aplicativos
4. Buscar "Provou Levou" e instalar
5. Tray redireciona para o webhook N8N
6. Verificar no banco se a loja foi registrada
7. Verificar na loja se o script foi injetado
8. Testar o provador virtual na loja
