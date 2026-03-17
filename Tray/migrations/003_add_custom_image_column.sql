-- Migration 003: Separate custom_image from photo_button JSONB
-- Prevents large base64 payloads from blocking design saves

ALTER TABLE store_designs
    ADD COLUMN custom_image TEXT;
