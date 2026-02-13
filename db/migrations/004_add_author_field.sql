-- Migration 004: Add author field to qr_codes table
-- This enables tracking who created each QR code

ALTER TABLE qr_codes
ADD COLUMN author VARCHAR(30) NOT NULL DEFAULT 'Unknown';

-- Track applied migration
INSERT INTO schema_migrations (version) VALUES (4)
ON CONFLICT (version) DO NOTHING;
