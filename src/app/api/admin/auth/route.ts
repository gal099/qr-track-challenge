/**
 * API Route: POST /api/admin/auth
 * Admin authentication endpoint with rate limiting
 */

import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { adminAuthSchema } from '@/lib/validations'
import { createAdminSession, clearAdminSession } from '@/lib/admin-session'
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/rate-limit'

const ADMIN_PASSWORD = 'yourpasswordhere'

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  return forwarded?.split(',')[0]?.trim() || realIP || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)

    // Check rate limit
    const rateLimit = checkRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Too many attempts. Try again later.',
          resetTime: rateLimit.resetTime.toISOString(),
        },
        { status: 429 }
      )
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate input
    const validatedData = adminAuthSchema.parse(body)

    // Check password
    if (validatedData.password !== ADMIN_PASSWORD) {
      recordFailedAttempt(ip)
      const updatedLimit = checkRateLimit(ip)

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid password',
          remainingAttempts: updatedLimit.remainingAttempts,
        },
        { status: 401 }
      )
    }

    // Success - clear rate limit and create session
    clearAttempts(ip)

    const response = NextResponse.json({
      success: true,
    })

    createAdminSession(response)

    return response
  } catch (error) {
    console.error('Admin auth error:', error)

    if (error instanceof ZodError) {
      const messages = error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(
        { success: false, error: messages || 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Authentication failed. Please try again.' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  clearAdminSession(response)
  return response
}
