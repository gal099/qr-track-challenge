-- Migration 003: Add soft delete column to qr_codes table
-- This enables soft delete functionality for QR codes

ALTER TABLE qr_codes
ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Add index for performance when filtering out deleted records
CREATE INDEX IF NOT EXISTS idx_qr_codes_deleted_at ON qr_codes(deleted_at);

-- Track applied migration
INSERT INTO schema_migrations (version) VALUES (3)
ON CONFLICT (version) DO NOTHING;
