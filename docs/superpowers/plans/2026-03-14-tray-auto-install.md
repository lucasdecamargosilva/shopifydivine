# Tray Auto-Install Integration — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Automatizar a instalacao do provador virtual em lojas Tray via app install + N8N workflow + script generico.

**Architecture:** Um workflow N8N recebe o callback OAuth da Tray, gera API key, salva no Postgres, e injeta um script JS generico na loja. O script e hospedado no EasyPanel e le a API key da propria URL.

**Tech Stack:** N8N (workflow automation), Postgres, Vanilla JS, Nginx/Caddy (static hosting), Tray API

**Spec:** `docs/superpowers/specs/2026-03-14-tray-auto-install-design.md`

---

## Chunk 1: Script Generico `provador-tray.js`

### Task 1: Criar `provador-tray.js` a partir do `provador-v3.js`

**Files:**
- Source: `Mariana Cardoso/provador-v3.js` (leitura)
- Create: `Tray/provador-tray.js`

- [ ] **Step 1: Copiar `provador-v3.js` para `Tray/provador-tray.js`**

```bash
mkdir -p "Tray"
cp "Mariana Cardoso/provador-v3.js" "Tray/provador-tray.js"
```

- [ ] **Step 2: Substituir API key hardcoded por leitura dinamica**

No arquivo `Tray/provador-tray.js`, substituir linhas 12-16:

```js
// ANTES:
// ===============================================
// 0. CHUMBAR A API KEY AQUI DIRETO NO CÓDIGO
// ===============================================
const apiKey = "pl_live_718051120233d56b27c6a394adcda4db687b687bd7f0c2924679c8700f085f5f";
window.PROVOU_LEVOU_API_KEY = apiKey;

// DEPOIS:
// ===============================================
// 0. LER API KEY DA URL DO SCRIPT
// ===============================================
const _selfScript = document.querySelector('script[src*="provador-tray"]');
const apiKey = _selfScript ? new URL(_selfScript.src).searchParams.get('key') : '';
if (!apiKey) { console.error('[Provou Levou] API key nao encontrada na URL do script'); return; }
window.PROVOU_LEVOU_API_KEY = apiKey;
```

- [ ] **Step 3: Substituir logo da Mariana Cardoso pelo logo generico Provou Levou**

No arquivo `Tray/provador-tray.js`, substituir linha 19:

```js
// ANTES:
const LOGO_URL = 'https://images.tcdn.com.br/files/1173244/themes/75/img/settings/logo-new.svg';

// DEPOIS:
const LOGO_URL = 'https://provoulevou.com.br/assets/provoulevou-logo.png';
```

- [ ] **Step 4: Atualizar mensagem de log**

Substituir linha 21:

```js
// ANTES:
LOG.info('Script carregado — Provador Virtual Mariana Cardoso (Tray)');

// DEPOIS:
LOG.info('Script carregado — Provador Virtual Provou Levou (Tray)');
```

- [ ] **Step 5: Atualizar alt text do logo no modal**

Substituir na linha 366 do HTML do modal:

```js
// ANTES:
alt="Mariana Cardoso"

// DEPOIS:
alt="Provou Levou"
```

- [ ] **Step 6: Testar script localmente**

Abrir `Tray/preview.html` (criar se necessario) no navegador para verificar:
- Script carrega sem erros no console
- API key e lida corretamente da URL (testar com `?key=pl_live_teste123`)
- Logo do Provou Levou aparece no modal
- Sem mencao a "Mariana Cardoso" na UI

- [ ] **Step 7: Commit**

```bash
git add "Tray/provador-tray.js"
git commit -m "feat: create generic provador-tray.js with dynamic API key loading"
```

---

### Task 2: Criar `preview.html` para testes locais

**Files:**
- Create: `Tray/preview.html`

- [ ] **Step 1: Criar arquivo de preview**

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview - Provador Virtual Tray</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .product-name { font-size: 24px; font-weight: bold; }
        .product-image img { max-width: 400px; }
    </style>
</head>
<body>
    <h1 class="product-name">Camiseta Oversized Premium</h1>
    <div class="product-image">
        <img src="https://via.placeholder.com/400x500?text=Produto+Teste" alt="Produto">
    </div>
    <p>R$ 149,90</p>

    <!-- Script com API key de teste na URL -->
    <script src="provador-tray.js?key=pl_live_teste_preview_key_123456"></script>
</body>
</html>
```

- [ ] **Step 2: Testar preview no navegador**

Abrir `Tray/preview.html` no navegador. Verificar:
- Botao "Provar" aparece na pagina
- Clicar no botao abre o modal do provador
- Console nao mostra erros
- API key e `pl_live_teste_preview_key_123456`

- [ ] **Step 3: Commit**

```bash
git add "Tray/preview.html"
git commit -m "feat: add preview.html for local testing of provador-tray.js"
```

---

## Chunk 2: Banco de Dados — Migrar tabela

### Task 3: Adicionar colunas a tabela `provou_levou_stores`

**Files:**
- Create: `Tray/migrations/001_add_tray_columns.sql`

- [ ] **Step 1: Criar arquivo SQL de migracao**

```sql
-- Migracao: Adicionar colunas para integracao Tray
-- Tabela: provou_levou_stores
-- Data: 2026-03-14

ALTER TABLE provou_levou_stores
    ADD COLUMN IF NOT EXISTS access_token TEXT,
    ADD COLUMN IF NOT EXISTS refresh_token TEXT,
    ADD COLUMN IF NOT EXISTS token_expiration TIMESTAMP,
    ADD COLUMN IF NOT EXISTS store_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS api_address TEXT,
    ADD COLUMN IF NOT EXISTS platform VARCHAR(20) DEFAULT 'manual';

-- Indice para busca por platform
CREATE INDEX IF NOT EXISTS idx_stores_platform ON provou_levou_stores(platform);

-- Indice para busca de tokens a renovar
CREATE INDEX IF NOT EXISTS idx_stores_token_exp ON provou_levou_stores(token_expiration)
    WHERE token_expiration IS NOT NULL;
```

- [ ] **Step 2: Executar migracao no Postgres**

Conectar ao banco Postgres (credenciais no N8N credential store, nome: "Postgres account") e executar o SQL acima.

Verificar resultado:
```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'provou_levou_stores'
ORDER BY ordinal_position;
```

Resultado esperado: deve incluir as novas colunas `access_token`, `refresh_token`, `token_expiration`, `store_id`, `api_address`, `platform`.

- [ ] **Step 3: Commit**

```bash
mkdir -p "Tray/migrations"
git add "Tray/migrations/001_add_tray_columns.sql"
git commit -m "feat: add migration for Tray integration columns in provou_levou_stores"
```

---

## Chunk 3: Workflow N8N — Tray Install

### Task 4: Criar workflow "Tray Install" no N8N

Este workflow e criado via API do N8N. Cada step abaixo corresponde a um node do workflow.

**Contexto:**
- N8N API: `https://n8n.segredosdodrop.com/api/v1`
- Token N8N: armazenado com seguranca (nao commitar)
- Consumer Key/Secret da Tray: configurar como variavel no N8N
- Postgres credential ID: `MwESWrWXk2YtoYba` (mesmo do workflow Quantic Materialize)

- [ ] **Step 1: Criar workflow via API do N8N**

Usar a API do N8N para criar o workflow com o JSON completo. O workflow contém 8 nodes:

```
POST https://n8n.segredosdodrop.com/api/v1/workflows
Header: X-N8N-API-KEY: {token}
Content-Type: application/json
```

Body do workflow (JSON completo):

```json
{
  "name": "[Tray Install] Provou Levou",
  "active": false,
  "nodes": [
    {
      "parameters": {
        "httpMethod": "GET",
        "path": "tray-install",
        "responseMode": "responseNode",
        "options": {}
      },
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2.1,
      "position": [0, 0],
      "name": "Webhook Tray Callback"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://{{ $json.query.api_address }}/auth",
        "sendBody": true,
        "contentType": "form-urlencoded",
        "bodyParameters": {
          "parameters": [
            { "name": "consumer_key", "value": "={{ $vars.TRAY_CONSUMER_KEY }}" },
            { "name": "consumer_secret", "value": "={{ $vars.TRAY_CONSUMER_SECRET }}" },
            { "name": "code", "value": "={{ $json.query.code }}" }
          ]
        },
        "options": { "timeout": 30000 }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [220, 0],
      "name": "Trocar Code por Tokens",
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "respondWith": "text",
        "responseBody": "<html><body><h1>Falha na autorizacao</h1><p>Nao foi possivel conectar com sua loja. Por favor, tente instalar o app novamente.</p></body></html>",
        "options": { "responseHeaders": { "entries": [{ "name": "Content-Type", "value": "text/html; charset=utf-8" }] } }
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.5,
      "position": [440, 200],
      "name": "Erro Auth"
    },
    {
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const crypto = require('crypto');\nconst storeHost = $('Webhook Tray Callback').item.json.query.store_host || '';\nif (!storeHost || storeHost.length < 4) throw new Error('store_host invalido: ' + storeHost);\nconst randomHex = crypto.randomBytes(32).toString('hex');\nconst apiKey = 'pl_live_' + randomHex;\nconst apiKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');\nconst domain = storeHost.startsWith('https://') ? storeHost : 'https://' + storeHost;\n\nreturn {\n  api_key: apiKey,\n  api_key_hash: apiKeyHash,\n  access_token: $json.access_token,\n  refresh_token: $json.refresh_token,\n  token_expiration: $json.date_expiration_access_token,\n  store_id: $json.store_id || $('Webhook Tray Callback').item.json.query.store,\n  api_address: $('Webhook Tray Callback').item.json.query.api_address,\n  domain: domain\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [440, 0],
      "name": "Gerar API Key + Hash"
    },
    {
      "parameters": {
        "operation": "insert",
        "schema": { "__rl": true, "mode": "list", "value": "public" },
        "table": { "__rl": true, "value": "provou_levou_stores", "mode": "list" },
        "columns": {
          "mappingMode": "defineBelow",
          "value": {
            "domain": "={{ $json.domain }}",
            "api_key_hash": "={{ $json.api_key_hash }}",
            "status": "Teste Gratuito",
            "access_token": "={{ $json.access_token }}",
            "refresh_token": "={{ $json.refresh_token }}",
            "token_expiration": "={{ $json.token_expiration }}",
            "store_id": "={{ $json.store_id }}",
            "api_address": "={{ $json.api_address }}",
            "platform": "tray"
          },
          "matchingColumns": ["domain"]
        },
        "options": { "onConflict": "updateOnConflict" }
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [660, 0],
      "name": "Salvar Loja no Banco",
      "credentials": {
        "postgres": {
          "id": "MwESWrWXk2YtoYba",
          "name": "Postgres account"
        }
      }
    },
    {
      "parameters": {
        "method": "GET",
        "url": "=https://{{ $('Gerar API Key + Hash').item.json.api_address }}/scripts?access_token={{ $('Gerar API Key + Hash').item.json.access_token }}",
        "options": { "timeout": 15000 }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [880, 0],
      "name": "Listar Scripts Existentes"
    },
    {
      "parameters": {
        "mode": "runOnceForEachItem",
        "jsCode": "const scripts = $json.ExternalScripts || [];\nconst alreadyInstalled = scripts.some(s => s.ExternalScript && s.ExternalScript.source && s.ExternalScript.source.includes('provador-tray'));\nconst apiKey = $('Gerar API Key + Hash').item.json.api_key;\nconst scriptUrl = 'https://lojista.provoulevou.com.br/provador-tray.js?key=' + apiKey;\n\nreturn {\n  already_installed: alreadyInstalled,\n  script_url: scriptUrl,\n  access_token: $('Gerar API Key + Hash').item.json.access_token,\n  api_address: $('Gerar API Key + Hash').item.json.api_address\n};"
      },
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [1100, 0],
      "name": "Verificar Idempotencia"
    },
    {
      "parameters": {
        "conditions": {
          "options": { "caseSensitive": true, "leftValue": "", "typeValidation": "strict", "version": 3 },
          "conditions": [
            {
              "leftValue": "={{ $json.already_installed }}",
              "rightValue": true,
              "operator": { "type": "boolean", "operation": "false", "singleValue": true }
            }
          ],
          "combinator": "and"
        },
        "options": {}
      },
      "type": "n8n-nodes-base.if",
      "typeVersion": 2.3,
      "position": [1320, 0],
      "name": "Ja Instalado?"
    },
    {
      "parameters": {
        "method": "POST",
        "url": "=https://{{ $json.api_address }}/scripts?access_token={{ $json.access_token }}",
        "sendBody": true,
        "specifyBody": "json",
        "jsonBody": "={ \"ExternalScript\": { \"source\": \"{{ $json.script_url }}\" } }",
        "options": { "timeout": 15000 }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [1540, -100],
      "name": "Injetar Script na Loja",
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "=UPDATE provou_levou_stores SET status = 'install_failed' WHERE domain = '{{ $('Gerar API Key + Hash').item.json.domain.replace(/'/g, \"''\") }}' AND platform = 'tray';",
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [1760, -200],
      "name": "Marcar Install Failed",
      "credentials": {
        "postgres": { "id": "MwESWrWXk2YtoYba", "name": "Postgres account" }
      }
    },
    {
      "parameters": {
        "respondWith": "text",
        "responseBody": "<html><head><meta charset='utf-8'></head><body><h1>Instalacao parcial</h1><p>Sua loja foi registrada mas houve um erro ao injetar o script. Nossa equipe sera notificada e o problema sera resolvido em breve.</p></body></html>",
        "options": { "responseHeaders": { "entries": [{ "name": "Content-Type", "value": "text/html; charset=utf-8" }] } }
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.5,
      "position": [1980, -200],
      "name": "Erro Inject"
    },
    {
      "parameters": {
        "respondWith": "text",
        "responseBody": "=<html><head><meta charset='utf-8'><style>body{font-family:Arial,sans-serif;display:flex;justify-content:center;align-items:center;min-height:100vh;margin:0;background:#f5f5f5;}div{text-align:center;background:white;padding:40px;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);max-width:500px;}h1{color:#2ecc71;margin-bottom:16px;}p{color:#555;line-height:1.6;}</style></head><body><div><h1>Provou Levou instalado com sucesso!</h1><p>O provador virtual ja esta ativo na sua loja. Seus clientes podem comecar a experimentar roupas virtualmente agora mesmo.</p></div></body></html>",
        "options": { "responseHeaders": { "entries": [{ "name": "Content-Type", "value": "text/html; charset=utf-8" }] } }
      },
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.5,
      "position": [1760, 0],
      "name": "Sucesso"
    }
  ],
  "connections": {
    "Webhook Tray Callback": { "main": [[{ "node": "Trocar Code por Tokens", "type": "main", "index": 0 }]] },
    "Trocar Code por Tokens": {
      "main": [
        [{ "node": "Gerar API Key + Hash", "type": "main", "index": 0 }],
        [{ "node": "Erro Auth", "type": "main", "index": 0 }]
      ]
    },
    "Gerar API Key + Hash": { "main": [[{ "node": "Salvar Loja no Banco", "type": "main", "index": 0 }]] },
    "Salvar Loja no Banco": { "main": [[{ "node": "Listar Scripts Existentes", "type": "main", "index": 0 }]] },
    "Listar Scripts Existentes": { "main": [[{ "node": "Verificar Idempotencia", "type": "main", "index": 0 }]] },
    "Verificar Idempotencia": { "main": [[{ "node": "Ja Instalado?", "type": "main", "index": 0 }]] },
    "Ja Instalado?": {
      "main": [
        [{ "node": "Injetar Script na Loja", "type": "main", "index": 0 }],
        [{ "node": "Sucesso", "type": "main", "index": 0 }]
      ]
    },
    "Injetar Script na Loja": {
      "main": [
        [{ "node": "Sucesso", "type": "main", "index": 0 }],
        [{ "node": "Marcar Install Failed", "type": "main", "index": 0 }]
      ]
    },
    "Marcar Install Failed": { "main": [[{ "node": "Erro Inject", "type": "main", "index": 0 }]] }
  }
}
```

- [ ] **Step 2: Configurar variaveis no N8N**

No painel do N8N, ir em Settings > Variables e criar:
- `TRAY_CONSUMER_KEY` = (valor da consumer key — nao commitar)
- `TRAY_CONSUMER_SECRET` = (valor da consumer secret — nao commitar)

- [ ] **Step 3: Ativar o workflow**

Via API:
```
PATCH https://n8n.segredosdodrop.com/api/v1/workflows/{workflow_id}
Header: X-N8N-API-KEY: {token}
Content-Type: application/json
Body: { "active": true }
```

- [ ] **Step 4: Testar webhook manualmente**

Abrir no navegador:
```
https://n8n.segredosdodrop.com/webhook/tray-install?code=teste_invalido&api_address=teste.tray.com.br/web_api&store=999&store_host=teste.tray.com.br
```

Resultado esperado: pagina HTML de erro "Falha na autorizacao" (porque o code e invalido).
Isso confirma que o webhook esta recebendo e processando.

- [ ] **Step 5: Salvar JSON do workflow no repositorio**

```bash
# Exportar workflow via API e salvar
curl -s -H "X-N8N-API-KEY: {token}" \
  "https://n8n.segredosdodrop.com/api/v1/workflows/{workflow_id}" \
  | python3 -m json.tool > "Tray/n8n-tray-install-workflow.json"

git add "Tray/n8n-tray-install-workflow.json"
git commit -m "feat: add N8N workflow for Tray auto-install"
```

---

## Chunk 4: Hospedagem do Script no EasyPanel

### Task 5: Configurar servidor estatico no EasyPanel

- [ ] **Step 1: Criar app no EasyPanel**

Acessar `http://72.61.128.136:3000` e criar um novo app:
- Nome: `provador-tray`
- Tipo: Static site (Nginx)
- Dominio: `lojista.provoulevou.com.br`
- HTTPS: ativar (Let's Encrypt)

- [ ] **Step 2: Fazer deploy do `provador-tray.js`**

Upload do arquivo `Tray/provador-tray.js` para o app no EasyPanel.
O arquivo deve ficar acessivel em:
```
https://lojista.provoulevou.com.br/provador-tray.js
```

- [ ] **Step 3: Configurar headers do Nginx**

Garantir que o Nginx serve com os headers corretos:
```nginx
location ~* \.js$ {
    add_header Content-Type "application/javascript; charset=utf-8";
    add_header Cache-Control "public, max-age=3600";
}
```

- [ ] **Step 4: Verificar acesso ao script**

```bash
curl -I "https://lojista.provoulevou.com.br/provador-tray.js?key=teste"
```

Resultado esperado:
- HTTP 200
- Content-Type: application/javascript
- O conteudo do script e retornado

- [ ] **Step 5: Commit configuracao (se aplicavel)**

Se houver arquivo de configuracao Nginx ou Docker:
```bash
git add "Tray/nginx.conf" # ou Dockerfile se criado
git commit -m "feat: add EasyPanel hosting config for provador-tray.js"
```

---

## Chunk 5: Teste End-to-End na Loja de Teste

### Task 6: Testar instalacao completa na loja de teste Tray

- [ ] **Step 1: Acessar loja de teste**

Acessar: `https://loja-s.tray.com.br/adm/login.php?loja=1225878`
Credenciais: no gerenciador de senhas

- [ ] **Step 2: Instalar o app "Provou Levou"**

1. Menu lateral > Aplicativos > Instalar novos aplicativos
2. Buscar "Provou Levou"
3. Clicar em Instalar
4. Tray redireciona para `https://n8n.segredosdodrop.com/webhook/tray-install?code=...`

Resultado esperado: pagina HTML "Provou Levou instalado com sucesso!"

- [ ] **Step 3: Verificar registro no banco de dados**

Executar no Postgres:
```sql
SELECT domain, status, platform, store_id, api_address,
       token_expiration, api_key_hash IS NOT NULL as has_key
FROM provou_levou_stores
WHERE platform = 'tray'
ORDER BY id DESC
LIMIT 1;
```

Resultado esperado: registro da loja de teste com status "Teste Gratuito", platform "tray".

- [ ] **Step 4: Verificar script injetado na loja**

Acessar a loja de teste (frontend) e inspecionar o HTML (View Source).
Buscar por `provador-tray.js`.

Resultado esperado: tag `<script>` com source contendo `lojista.provoulevou.com.br/provador-tray.js?key=pl_live_...`

- [ ] **Step 5: Testar o provador virtual**

1. Acessar uma pagina de produto na loja de teste
2. Verificar que o botao "Provar" aparece
3. Clicar no botao e preencher o formulario
4. Enviar foto e verificar que o webhook Quantic Materialize recebe a requisicao

- [ ] **Step 6: Commit final**

```bash
git add "Tray/"
git commit -m "feat: complete Tray auto-install integration - tested end-to-end"
```

---

## Chunk 6: Workflow N8N — Renovacao de Tokens (Cron)

### Task 7: Criar workflow de renovacao automatica de tokens

- [ ] **Step 1: Criar workflow via API do N8N**

```
POST https://n8n.segredosdodrop.com/api/v1/workflows
```

Body:
```json
{
  "name": "[Tray Token Refresh] Provou Levou",
  "active": false,
  "nodes": [
    {
      "parameters": {
        "rule": { "interval": [{ "field": "hours", "hoursInterval": 24 }] }
      },
      "type": "n8n-nodes-base.scheduleTrigger",
      "typeVersion": 1.2,
      "position": [0, 0],
      "name": "Cron Diario"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "SELECT id, domain, refresh_token, api_address FROM provou_levou_stores WHERE platform = 'tray' AND token_expiration IS NOT NULL AND token_expiration < NOW() + INTERVAL '7 days' AND status IN ('Ativo', 'Teste Gratuito');",
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [220, 0],
      "name": "Buscar Tokens Expirando",
      "credentials": {
        "postgres": { "id": "MwESWrWXk2YtoYba", "name": "Postgres account" }
      }
    },
    {
      "parameters": {
        "url": "=https://{{ $json.api_address }}/auth?refresh_token={{ $json.refresh_token }}",
        "options": { "timeout": 15000 }
      },
      "type": "n8n-nodes-base.httpRequest",
      "typeVersion": 4.4,
      "position": [440, 0],
      "name": "Refresh Token Tray",
      "onError": "continueErrorOutput"
    },
    {
      "parameters": {
        "operation": "executeQuery",
        "query": "=UPDATE provou_levou_stores SET access_token = '{{ $json.access_token }}', refresh_token = '{{ $json.refresh_token }}', token_expiration = '{{ $json.date_expiration_access_token }}' WHERE id = {{ $('Buscar Tokens Expirando').item.json.id }};",
        "options": {}
      },
      "type": "n8n-nodes-base.postgres",
      "typeVersion": 2.6,
      "position": [660, 0],
      "name": "Atualizar Tokens no Banco",
      "credentials": {
        "postgres": { "id": "MwESWrWXk2YtoYba", "name": "Postgres account" }
      }
    }
  ],
  "connections": {
    "Cron Diario": { "main": [[{ "node": "Buscar Tokens Expirando", "type": "main", "index": 0 }]] },
    "Buscar Tokens Expirando": { "main": [[{ "node": "Refresh Token Tray", "type": "main", "index": 0 }]] },
    "Refresh Token Tray": {
      "main": [
        [{ "node": "Atualizar Tokens no Banco", "type": "main", "index": 0 }],
        []
      ]
    }
  }
}
```

- [ ] **Step 2: Ativar o workflow**

Via API:
```
PATCH https://n8n.segredosdodrop.com/api/v1/workflows/{workflow_id}
Body: { "active": true }
```

- [ ] **Step 3: Testar manualmente (trigger manual no N8N)**

No painel N8N, abrir o workflow e clicar "Test Workflow".
Se nao houver tokens para renovar, a query retorna vazio e o workflow termina normalmente.

- [ ] **Step 4: Salvar JSON e commitar**

```bash
curl -s -H "X-N8N-API-KEY: {token}" \
  "https://n8n.segredosdodrop.com/api/v1/workflows/{workflow_id}" \
  | python3 -m json.tool > "Tray/n8n-token-refresh-workflow.json"

git add "Tray/n8n-token-refresh-workflow.json"
git commit -m "feat: add N8N workflow for automatic Tray token refresh"
```

---

## Resumo dos Entregaveis

| # | Entregavel | Status |
|---|---|---|
| 1 | `Tray/provador-tray.js` — script generico | - [ ] |
| 2 | `Tray/preview.html` — pagina de teste local | - [ ] |
| 3 | `Tray/migrations/001_add_tray_columns.sql` — migracao SQL | - [ ] |
| 4 | Workflow N8N "Tray Install" — instalacao automatica | - [ ] |
| 5 | Script hospedado em `lojista.provoulevou.com.br` | - [ ] |
| 6 | Teste end-to-end na loja de teste Tray | - [ ] |
| 7 | Workflow N8N "Token Refresh" — renovacao automatica | - [ ] |
