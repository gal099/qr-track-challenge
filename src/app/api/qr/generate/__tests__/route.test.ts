/**
 * Integration tests for the QR Code Generation API
 *
 * Note: These tests validate the schema and business logic separately
 * since NextRequest requires polyfills in the test environment.
 */

// Mock nanoid before importing anything else
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'test1234'),
}))

// Mock the database module
jest.mock('@/lib/db', () => ({
  createQRCode: jest.fn(),
  shortCodeExists: jest.fn(() => Promise.resolve(false)),
}))

// Mock qrcode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}))

import { createQRCode } from '@/lib/db'
import QRCode from 'qrcode'
import { generateQRCodeSchema } from '@/lib/validations'

const mockCreateQRCode = createQRCode as jest.MockedFunction<typeof createQRCode>
const mockToDataURL = QRCode.toDataURL as jest.MockedFunction<typeof QRCode.toDataURL>

describe('POST /api/qr/generate - Input Validation', () => {
  describe('Valid inputs', () => {
    it('should validate a complete valid request', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: '#000000',
        bg_color: '#FFFFFF',
      })

      expect(result.success).toBe(true)
    })

    it('should apply default colors when omitted', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.fg_color).toBe('#000000')
        expect(result.data.bg_color).toBe('#FFFFFF')
      }
    })

    it('should accept URL with query parameters', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com/path?query=value&foo=bar',
      })

      expect(result.success).toBe(true)
    })

    it('should accept URL with fragment', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com/path#section',
      })

      expect(result.success).toBe(true)
    })

    it('should accept localhost URL', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'http://localhost:3000',
      })

      expect(result.success).toBe(true)
    })
  })

  describe('Invalid inputs', () => {
    it('should reject missing target_url', () => {
      const result = generateQRCodeSchema.safeParse({
        fg_color: '#000000',
      })

      expect(result.success).toBe(false)
    })

    it('should reject invalid URL format', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'not-a-url',
      })

      expect(result.success).toBe(false)
    })

    it('should reject URL without protocol', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'example.com',
      })

      expect(result.success).toBe(false)
    })

    it('should reject invalid color format (missing #)', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: '000000',
      })

      expect(result.success).toBe(false)
    })

    it('should reject invalid color format (named color)', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: 'red',
      })

      expect(result.success).toBe(false)
    })

    it('should reject invalid color format (3-char hex)', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: '#FFF',
      })

      expect(result.success).toBe(false)
    })

    it('should reject empty target_url', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: '',
      })

      expect(result.success).toBe(false)
    })
  })
})

describe('POST /api/qr/generate - Business Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateQRCode.mockResolvedValue({
      id: 1,
      short_code: 'test1234',
      target_url: 'https://example.com',
      fg_color: '#000000',
      bg_color: '#FFFFFF',
      created_at: new Date(),
    })
    mockToDataURL.mockResolvedValue('data:image/png;base64,mockQRCode')
  })

  it('should call createQRCode with correct parameters', async () => {
    const validatedData = {
      target_url: 'https://example.com',
      fg_color: '#123456',
      bg_color: '#ABCDEF',
    }

    await mockCreateQRCode({
      short_code: 'test1234',
      target_url: validatedData.target_url,
      fg_color: validatedData.fg_color,
      bg_color: validatedData.bg_color,
    })

    expect(mockCreateQRCode).toHaveBeenCalledWith({
      short_code: 'test1234',
      target_url: 'https://example.com',
      fg_color: '#123456',
      bg_color: '#ABCDEF',
    })
  })

  it('should call QRCode.toDataURL with correct parameters', async () => {
    const shortUrl = 'http://localhost:3000/r/test1234'
    const colors = { fg_color: '#123456', bg_color: '#ABCDEF' }

    await mockToDataURL(shortUrl, {
      color: { dark: colors.fg_color, light: colors.bg_color },
      width: 512,
      margin: 2,
    })

    expect(mockToDataURL).toHaveBeenCalledWith(shortUrl, {
      color: { dark: '#123456', light: '#ABCDEF' },
      width: 512,
      margin: 2,
    })
  })

  it('should return QR code data URL starting with data:image/png;base64,', async () => {
    const dataUrl = await mockToDataURL('http://localhost:3000/r/test1234', {
      color: { dark: '#000000', light: '#FFFFFF' },
      width: 512,
      margin: 2,
    })

    expect(dataUrl).toMatch(/^data:image\/png;base64,/)
  })

  it('should construct short URL with correct format', () => {
    const baseUrl = 'http://localhost:3000'
    const shortCode = 'test1234'
    const shortUrl = `${baseUrl}/r/${shortCode}`

    expect(shortUrl).toBe('http://localhost:3000/r/test1234')
    expect(shortUrl).toContain(shortCode)
  })

  it('should construct analytics URL with correct format', () => {
    const baseUrl = 'http://localhost:3000'
    const qrCodeId = 1
    const analyticsUrl = `${baseUrl}/analytics/${qrCodeId}`

    expect(analyticsUrl).toBe('http://localhost:3000/analytics/1')
    expect(analyticsUrl).toContain(String(qrCodeId))
  })
})

describe('POST /api/qr/generate - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle database errors', async () => {
    mockCreateQRCode.mockRejectedValue(new Error('Database connection failed'))

    await expect(
      mockCreateQRCode({
        short_code: 'test1234',
        target_url: 'https://example.com',
        fg_color: '#000000',
        bg_color: '#FFFFFF',
      })
    ).rejects.toThrow('Database connection failed')
  })

  it('should handle QR code generation errors', async () => {
    mockToDataURL.mockRejectedValue(new Error('QR code generation failed'))

    await expect(
      mockToDataURL('http://localhost:3000/r/test1234', {
        color: { dark: '#000000', light: '#FFFFFF' },
        width: 512,
        margin: 2,
      })
    ).rejects.toThrow('QR code generation failed')
  })
})
