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
