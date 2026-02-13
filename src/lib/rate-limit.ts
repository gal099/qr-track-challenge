/**
 * In-memory rate limiting utility for admin password attempts
 * Tracks attempts by IP address with configurable limits and time windows
 */

interface RateLimitEntry {
  attempts: number
  firstAttempt: Date
}

const rateLimitStore = new Map<string, RateLimitEntry>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 60 * 60 * 1000 // 1 hour in milliseconds

/**
 * Clean up expired entries from the store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now()
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now - entry.firstAttempt.getTime() > WINDOW_MS) {
      rateLimitStore.delete(ip)
    }
  }
}

/**
 * Check if an IP address is within rate limits
 */
export function checkRateLimit(ip: string): {
  allowed: boolean
  remainingAttempts: number
  resetTime: Date
} {
  cleanupExpiredEntries()

  const entry = rateLimitStore.get(ip)

  if (!entry) {
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      resetTime: new Date(Date.now() + WINDOW_MS),
    }
  }

  const now = Date.now()
  const timeSinceFirst = now - entry.firstAttempt.getTime()

  // If window has expired, allow the request
  if (timeSinceFirst > WINDOW_MS) {
    rateLimitStore.delete(ip)
    return {
      allowed: true,
      remainingAttempts: MAX_ATTEMPTS,
      resetTime: new Date(now + WINDOW_MS),
    }
  }

  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - entry.attempts)
  const resetTime = new Date(entry.firstAttempt.getTime() + WINDOW_MS)

  return {
    allowed: remainingAttempts > 0,
    remainingAttempts,
    resetTime,
  }
}

/**
 * Record a failed attempt for an IP address
 */
export function recordFailedAttempt(ip: string): void {
  cleanupExpiredEntries()

  const entry = rateLimitStore.get(ip)

  if (!entry) {
    rateLimitStore.set(ip, {
      attempts: 1,
      firstAttempt: new Date(),
    })
    return
  }

  const now = Date.now()
  const timeSinceFirst = now - entry.firstAttempt.getTime()

  // If window has expired, start a new one
  if (timeSinceFirst > WINDOW_MS) {
    rateLimitStore.set(ip, {
      attempts: 1,
      firstAttempt: new Date(),
    })
    return
  }

  // Increment attempts within the current window
  entry.attempts += 1
}

/**
 * Clear attempts for an IP address (call on successful login)
 */
export function clearAttempts(ip: string): void {
  rateLimitStore.delete(ip)
}
