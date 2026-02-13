/**
 * Database types matching the schema defined in db/schema.sql
 */

export interface QRCode {
  id: number
  short_code: string
  target_url: string
  fg_color: string
  bg_color: string
  created_at: Date
  deleted_at: Date | null
}

export interface QRCodeWithScans extends QRCode {
  total_scans: number
}

export interface Scan {
  id: number
  qr_code_id: number
  scanned_at: Date
  user_agent: string | null
  ip_address: string | null
  country: string | null
  city: string | null
  device_type: 'mobile' | 'tablet' | 'desktop' | 'unknown' | null
  browser: string | null
}

export interface ScanAnalytics {
  total_scans: number
  scans_by_date: { date: string; count: number }[]
  device_breakdown: { device_type: string; count: number }[]
  browser_breakdown: { browser: string; count: number }[]
  location_breakdown: { country: string; city: string; count: number }[]
}

export interface CreateQRCodeInput {
  target_url: string
  fg_color?: string
  bg_color?: string
}

export interface CreateScanInput {
  qr_code_id: number
  user_agent?: string
  ip_address?: string
  country?: string
  city?: string
  device_type?: 'mobile' | 'tablet' | 'desktop' | 'unknown'
  browser?: string
}
