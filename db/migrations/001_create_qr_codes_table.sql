-- Migration 001: Create qr_codes table
-- This table stores QR code metadata including target URL, colors, and short code

CREATE TABLE IF NOT EXISTS qr_codes (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(21) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    fg_color VARCHAR(7) NOT NULL DEFAULT '#000000',
    bg_color VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE UNIQUE INDEX IF NOT EXISTS idx_qr_codes_short_code ON qr_codes(short_code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);

-- Constraints
ALTER TABLE qr_codes
    ADD CONSTRAINT IF NOT EXISTS check_fg_color_format CHECK (fg_color ~ '^#[0-9A-Fa-f]{6}$');

ALTER TABLE qr_codes
    ADD CONSTRAINT IF NOT EXISTS check_bg_color_format CHECK (bg_color ~ '^#[0-9A-Fa-f]{6}$');

ALTER TABLE qr_codes
    ADD CONSTRAINT IF NOT EXISTS check_target_url_not_empty CHECK (LENGTH(target_url) > 0);

-- Track applied migration
CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO schema_migrations (version) VALUES (1)
ON CONFLICT (version) DO NOTHING;
