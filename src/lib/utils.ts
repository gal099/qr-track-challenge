/**
 * Utility functions for QR code generation and analytics
 */

import { nanoid } from 'nanoid'
import { shortCodeExists } from './db'
import UAParser from 'ua-parser-js'

/**
 * Generate a unique short code for URL shortening
 * Uses nanoid with retry logic for collision resistance
 */
export async function generateUniqueShortCode(): Promise<string> {
  const maxRetries = 5
  let retries = 0

  while (retries < maxRetries) {
    const shortCode = nanoid(8) // 8-character code
    const exists = await shortCodeExists(shortCode)

    if (!exists) {
      return shortCode
    }

    retries++
  }

  // Fallback to longer code if collisions persist
  return nanoid(12)
}

/**
 * Parse user agent string to extract device type and browser
 */
export function parseUserAgent(userAgentString: string) {
  const parser = new UAParser(userAgentString)
  const result = parser.getResult()

  const deviceType = (() => {
    if (result.device.type === 'mobile') return 'mobile'
    if (result.device.type === 'tablet') return 'tablet'
    if (result.device.type) return result.device.type as 'desktop'
    return 'desktop' // Default to desktop if unknown
  })()

  const browser = result.browser.name || 'unknown'

  return {
    device_type: deviceType,
    browser,
  }
}

/**
 * Get geolocation from Vercel Edge headers
 * Falls back to unknown if headers are not available
 */
export function getGeolocationFromHeaders(headers: Headers) {
  const country = headers.get('x-vercel-ip-country') || undefined
  const city = headers.get('x-vercel-ip-city') || undefined

  return { country, city }
}

/**
 * Get client IP address from request headers
 * Returns truncated IP for privacy (last octet replaced with xxx)
 */
export function getClientIP(headers: Headers): string | undefined {
  const ip =
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    undefined

  if (!ip) return undefined

  // Truncate last octet for privacy
  const parts = ip.split('.')
  if (parts.length === 4) {
    parts[3] = 'xxx'
    return parts.join('.')
  }

  // For IPv6, truncate last segment
  const ipv6Parts = ip.split(':')
  if (ipv6Parts.length > 2) {
    ipv6Parts[ipv6Parts.length - 1] = 'xxxx'
    return ipv6Parts.join(':')
  }

  return 'unknown'
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color)
}
