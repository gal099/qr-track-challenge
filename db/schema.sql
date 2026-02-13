-- QR Track Database Schema
-- Complete schema for fresh installations
-- Apply migrations sequentially in production

-- Migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version INTEGER PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR Codes table
CREATE TABLE IF NOT EXISTS qr_codes (
    id SERIAL PRIMARY KEY,
    short_code VARCHAR(21) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    fg_color VARCHAR(7) NOT NULL DEFAULT '#000000',
    bg_color VARCHAR(7) NOT NULL DEFAULT '#FFFFFF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for qr_codes
CREATE UNIQUE INDEX IF NOT EXISTS idx_qr_codes_short_code ON qr_codes(short_code);
CREATE INDEX IF NOT EXISTS idx_qr_codes_created_at ON qr_codes(created_at DESC);

-- Constraints for qr_codes
ALTER TABLE qr_codes
    ADD CONSTRAINT IF NOT EXISTS check_fg_color_format CHECK (fg_color ~ '^#[0-9A-Fa-f]{6}$'),
    ADD CONSTRAINT IF NOT EXISTS check_bg_color_format CHECK (bg_color ~ '^#[0-9A-Fa-f]{6}$'),
    ADD CONSTRAINT IF NOT EXISTS check_target_url_not_empty CHECK (LENGTH(target_url) > 0);

-- Scans table
CREATE TABLE IF NOT EXISTS scans (
    id SERIAL PRIMARY KEY,
    qr_code_id INTEGER NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_agent TEXT,
    ip_address VARCHAR(45),
    country VARCHAR(2),
    city VARCHAR(100),
    device_type VARCHAR(20),
    browser VARCHAR(50)
);

-- Indexes for scans
CREATE INDEX IF NOT EXISTS idx_scans_qr_code_id ON scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_scans_scanned_at ON scans(scanned_at DESC);
CREATE INDEX IF NOT EXISTS idx_scans_country ON scans(country);

-- Constraints for scans
ALTER TABLE scans
    ADD CONSTRAINT IF NOT EXISTS check_device_type_enum
        CHECK (device_type IN ('mobile', 'tablet', 'desktop', 'unknown') OR device_type IS NULL);

-- Sample data for testing (optional - comment out for production)
-- INSERT INTO qr_codes (short_code, target_url, fg_color, bg_color) VALUES
-- ('sample_code_123', 'https://example.com', '#000000', '#FFFFFF');
