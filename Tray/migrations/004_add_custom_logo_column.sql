-- Migration 004: Add custom_logo column for store branding inside the provador modal

ALTER TABLE store_designs
    ADD COLUMN custom_logo TEXT;
