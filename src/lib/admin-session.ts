/**
 * Admin session management utilities
 * Handles session cookie creation, validation, and clearing
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_SESSION_COOKIE = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 // 1 hour in seconds

/**
 * Create an admin session by setting a secure cookie
 */
export function createAdminSession(response: NextResponse): void {
  const sessionToken = generateSessionToken()
  const isProduction = process.env.NODE_ENV === 'production'

  response.cookies.set(ADMIN_SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/**
 * Validate if a valid admin session exists
 */
export function validateAdminSession(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)
  return sessionCookie !== undefined && sessionCookie.value.length > 0
}

/**
 * Check if admin session exists (for use in Server Components)
 */
export async function hasAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)
  return sessionCookie !== undefined && sessionCookie.value.length > 0
}

/**
 * Clear the admin session cookie
 */
export function clearAdminSession(response: NextResponse): void {
  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
}

/**
 * Generate a random session token
 */
function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}
