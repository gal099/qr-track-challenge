/**
 * Server-only utility functions
 * These functions require database access and should only be used on the server
 */

import { nanoid } from 'nanoid'
import { shortCodeExists } from './db'

// Re-export client-safe utilities for convenience
export {
  parseUserAgent,
  getGeolocationFromHeaders,
  getClientIP,
  isValidUrl,
  isValidHexColor,
} from './utils-client'

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
