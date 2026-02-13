/**
 * Database connection and query utilities
 * Using @vercel/postgres for Vercel Postgres integration
 */

import { sql } from '@vercel/postgres'
import type {
  QRCode,
  QRCodeWithScans,
  Scan,
  CreateQRCodeInput,
  CreateScanInput,
  ScanAnalytics,
} from '@/types/database'

/**
 * Create a new QR code record
 */
export async function createQRCode(
  input: CreateQRCodeInput & { short_code: string }
): Promise<QRCode> {
  const { short_code, target_url, fg_color = '#000000', bg_color = '#FFFFFF' } = input

  const result = await sql`
    INSERT INTO qr_codes (short_code, target_url, fg_color, bg_color)
    VALUES (${short_code}, ${target_url}, ${fg_color}, ${bg_color})
    RETURNING *
  `

  return result.rows[0] as QRCode
}

/**
 * Get QR code by short code
 */
export async function getQRCodeByShortCode(
  shortCode: string
): Promise<QRCode | null> {
  const result = await sql`
    SELECT * FROM qr_codes WHERE short_code = ${shortCode} LIMIT 1
  `

  return result.rows.length > 0 ? (result.rows[0] as QRCode) : null
}

/**
 * Get QR code by ID
 */
export async function getQRCodeById(id: number): Promise<QRCode | null> {
  const result = await sql`
    SELECT * FROM qr_codes WHERE id = ${id} LIMIT 1
  `

  return result.rows.length > 0 ? (result.rows[0] as QRCode) : null
}

/**
 * Check if short code exists
 */
export async function shortCodeExists(shortCode: string): Promise<boolean> {
  const result = await sql`
    SELECT 1 FROM qr_codes WHERE short_code = ${shortCode} LIMIT 1
  `

  return result.rows.length > 0
}

/**
 * Create a scan event record
 */
export async function createScan(input: CreateScanInput): Promise<Scan> {
  const {
    qr_code_id,
    user_agent,
    ip_address,
    country,
    city,
    device_type,
    browser,
  } = input

  const result = await sql`
    INSERT INTO scans (
      qr_code_id, user_agent, ip_address, country, city, device_type, browser
    )
    VALUES (
      ${qr_code_id}, ${user_agent || null}, ${ip_address || null},
      ${country || null}, ${city || null}, ${device_type || null}, ${browser || null}
    )
    RETURNING *
  `

  return result.rows[0] as Scan
}

/**
 * Get all QR codes with total scan counts
 */
export async function getAllQRCodes(): Promise<QRCodeWithScans[]> {
  const result = await sql`
    SELECT
      qr.id,
      qr.short_code,
      qr.target_url,
      qr.fg_color,
      qr.bg_color,
      qr.created_at,
      COALESCE(COUNT(s.id), 0) as total_scans
    FROM qr_codes qr
    LEFT JOIN scans s ON qr.id = s.qr_code_id
    GROUP BY qr.id, qr.short_code, qr.target_url, qr.fg_color, qr.bg_color, qr.created_at
    ORDER BY qr.created_at DESC
  `

  return result.rows.map((row) => ({
    id: row.id,
    short_code: row.short_code,
    target_url: row.target_url,
    fg_color: row.fg_color,
    bg_color: row.bg_color,
    created_at: row.created_at,
    total_scans: parseInt(row.total_scans),
  })) as QRCodeWithScans[]
}

/**
 * Get analytics for a QR code
 */
export async function getQRCodeAnalytics(
  qrCodeId: number
): Promise<ScanAnalytics> {
  // Total scans
  const totalResult = await sql`
    SELECT COUNT(*) as total_scans FROM scans WHERE qr_code_id = ${qrCodeId}
  `

  // Scans by date (daily)
  const dateResult = await sql`
    SELECT
      DATE(scanned_at) as date,
      COUNT(*) as count
    FROM scans
    WHERE qr_code_id = ${qrCodeId}
    GROUP BY DATE(scanned_at)
    ORDER BY date ASC
  `

  // Device breakdown
  const deviceResult = await sql`
    SELECT
      COALESCE(device_type, 'unknown') as device_type,
      COUNT(*) as count
    FROM scans
    WHERE qr_code_id = ${qrCodeId}
    GROUP BY device_type
  `

  // Browser breakdown
  const browserResult = await sql`
    SELECT
      COALESCE(browser, 'unknown') as browser,
      COUNT(*) as count
    FROM scans
    WHERE qr_code_id = ${qrCodeId}
    GROUP BY browser
    ORDER BY count DESC
    LIMIT 10
  `

  // Location breakdown
  const locationResult = await sql`
    SELECT
      COALESCE(country, 'unknown') as country,
      COALESCE(city, 'unknown') as city,
      COUNT(*) as count
    FROM scans
    WHERE qr_code_id = ${qrCodeId}
    GROUP BY country, city
    ORDER BY count DESC
    LIMIT 20
  `

  return {
    total_scans: parseInt(totalResult.rows[0]?.total_scans || '0'),
    scans_by_date: dateResult.rows.map((row) => ({
      date: row.date,
      count: parseInt(row.count),
    })),
    device_breakdown: deviceResult.rows.map((row) => ({
      device_type: row.device_type,
      count: parseInt(row.count),
    })),
    browser_breakdown: browserResult.rows.map((row) => ({
      browser: row.browser,
      count: parseInt(row.count),
    })),
    location_breakdown: locationResult.rows.map((row) => ({
      country: row.country,
      city: row.city,
      count: parseInt(row.count),
    })),
  }
}
