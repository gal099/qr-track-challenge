/**
 * API Route: POST /api/qr/generate
 * Generate a new QR code with short URL
 */

import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { ZodError } from 'zod'
import { generateQRCodeSchema } from '@/lib/validations'
import { createQRCode } from '@/lib/db'
import { generateUniqueShortCode } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
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
    const validatedData = generateQRCodeSchema.parse(body)

    // Generate unique short code
    const shortCode = await generateUniqueShortCode()

    // Create QR code record in database
    const qrCode = await createQRCode({
      short_code: shortCode,
      target_url: validatedData.target_url,
      fg_color: validatedData.fg_color,
      bg_color: validatedData.bg_color,
      author: validatedData.author,
    })

    // Generate QR code image as data URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const shortUrl = `${baseUrl}/r/${shortCode}`

    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl, {
      color: {
        dark: validatedData.fg_color,
        light: validatedData.bg_color,
      },
      width: 512,
      margin: 2,
    })

    return NextResponse.json({
      success: true,
      data: {
        qr_code_id: qrCode.id,
        short_code: shortCode,
        short_url: shortUrl,
        target_url: validatedData.target_url,
        qr_code_data_url: qrCodeDataUrl,
        analytics_url: `${baseUrl}/analytics/${qrCode.id}`,
      },
    })
  } catch (error) {
    console.error('QR generation error:', error)

    if (error instanceof ZodError) {
      const messages = error.errors.map((e) => e.message).join(', ')
      return NextResponse.json(
        { success: false, error: messages || 'Invalid input data' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code. Please try again.' },
      { status: 500 }
    )
  }
}
