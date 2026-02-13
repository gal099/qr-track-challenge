/**
 * API Route: DELETE /api/admin/qr/[shortCode]
 * Soft delete a QR code (requires admin session)
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateAdminSession } from '@/lib/admin-session'
import { softDeleteQRCode } from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { shortCode: string } }
) {
  try {
    // Validate admin session
    if (!validateAdminSession(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { shortCode } = params

    // Validate shortCode parameter
    if (!shortCode || shortCode.length < 1 || shortCode.length > 21) {
      return NextResponse.json(
        { success: false, error: 'Invalid short code format' },
        { status: 400 }
      )
    }

    // Attempt to soft delete
    const deleted = await softDeleteQRCode(shortCode)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'QR code not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin QR delete error:', error)

    return NextResponse.json(
      { success: false, error: 'Failed to delete QR code. Please try again.' },
      { status: 500 }
    )
  }
}
