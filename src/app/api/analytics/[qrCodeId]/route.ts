/**
 * API Route: GET /api/analytics/[qrCodeId]
 * Fetch analytics data for a specific QR code
 */

import { NextRequest, NextResponse } from 'next/server'
import { getQRCodeById, getQRCodeAnalytics } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { qrCodeId: string } }
) {
  try {
    const qrCodeId = parseInt(params.qrCodeId)

    if (isNaN(qrCodeId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid QR code ID' },
        { status: 400 }
      )
    }

    // Check if QR code exists
    const qrCode = await getQRCodeById(qrCodeId)

    if (!qrCode) {
      return NextResponse.json(
        { success: false, error: 'QR code not found' },
        { status: 404 }
      )
    }

    // Get analytics data
    const analytics = await getQRCodeAnalytics(qrCodeId)

    return NextResponse.json({
      success: true,
      data: {
        qr_code: {
          id: qrCode.id,
          short_code: qrCode.short_code,
          target_url: qrCode.target_url,
          created_at: qrCode.created_at,
        },
        analytics,
      },
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)

    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
