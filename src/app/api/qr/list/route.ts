/**
 * API Route: GET /api/qr/list
 * List all QR codes with summary data
 */

import { NextResponse } from 'next/server'
import { getAllQRCodes } from '@/lib/db'

export async function GET() {
  try {
    const qrCodes = await getAllQRCodes()

    return NextResponse.json({
      success: true,
      data: {
        qr_codes: qrCodes,
      },
    })
  } catch (error) {
    console.error('QR list error:', error)

    const errorMessage =
      error instanceof Error && error.message.includes('connect')
        ? 'Database connection error. Please try again later.'
        : 'Failed to fetch QR codes. Please try again.'

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    )
  }
}
