/**
 * API Route: GET /r/[shortCode]
 * Redirect to target URL and track scan event
 */

import { NextRequest, NextResponse } from 'next/server'
import { getQRCodeByShortCode, createScan } from '@/lib/db'
import {
  parseUserAgent,
  getGeolocationFromHeaders,
  getClientIP,
} from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    const { shortCode } = params

    // Lookup QR code
    const qrCode = await getQRCodeByShortCode(shortCode)

    if (!qrCode) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      )
    }

    // Parse user agent
    const userAgent = request.headers.get('user-agent') || ''
    const { device_type, browser } = parseUserAgent(userAgent)

    // Get geolocation from Vercel headers
    const { country, city } = getGeolocationFromHeaders(request.headers)

    // Get client IP (truncated for privacy)
    const ipAddress = getClientIP(request.headers)

    // Track scan event (non-blocking)
    createScan({
      qr_code_id: qrCode.id,
      user_agent: userAgent || undefined,
      ip_address: ipAddress,
      country,
      city,
      device_type,
      browser,
    }).catch((error) => {
      // Log error but don't block redirect
      console.error('Failed to track scan:', error)
    })

    // Redirect to target URL
    return NextResponse.redirect(qrCode.target_url, 302)
  } catch (error) {
    console.error('Redirect error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
