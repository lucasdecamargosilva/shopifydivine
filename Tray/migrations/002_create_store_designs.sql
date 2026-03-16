-- Migration 002: Create store_designs table for button designer
-- Prerequisite: provou_levou_stores.store_id must have UNIQUE constraint

ALTER TABLE provou_levou_stores
    ADD CONSTRAINT uq_stores_store_id UNIQUE (store_id);

CREATE TABLE store_designs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL UNIQUE
        REFERENCES provou_levou_stores(store_id) ON DELETE CASCADE,
    photo_button JSONB NOT NULL DEFAULT '{}',
    buy_button JSONB NOT NULL DEFAULT '{}',
    button_mode VARCHAR(10) DEFAULT 'both'
        CHECK (button_mode IN ('image', 'buy', 'both')),
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER store_designs_updated_at
    BEFORE UPDATE ON store_designs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
