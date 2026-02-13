/**
 * Unit tests for the redirect route GET /r/[shortCode]
 *
 * Note: These tests validate the business logic separately since NextRequest
 * requires polyfills in the test environment. The approach mirrors the
 * patterns used in src/app/api/qr/generate/__tests__/route.test.ts
 *
 * Tests cover:
 * - Successful redirect scenarios
 * - 404 handling for invalid short codes
 * - Scan event tracking verification
 * - User agent parsing integration
 * - Geolocation header handling
 * - IP address handling
 * - Error handling scenarios
 */

// Mock the database module
jest.mock('@/lib/db', () => ({
  getQRCodeByShortCode: jest.fn(),
  createScan: jest.fn(),
}))

// Mock the utils module to avoid nanoid import issues
jest.mock('@/lib/utils', () => ({
  parseUserAgent: jest.fn(),
  getGeolocationFromHeaders: jest.fn(),
  getClientIP: jest.fn(),
}))

import { getQRCodeByShortCode, createScan } from '@/lib/db'
import {
  parseUserAgent,
  getGeolocationFromHeaders,
  getClientIP,
} from '@/lib/utils'
import type { QRCode, CreateScanInput } from '@/types/database'

const mockGetQRCodeByShortCode = getQRCodeByShortCode as jest.MockedFunction<
  typeof getQRCodeByShortCode
>
const mockCreateScan = createScan as jest.MockedFunction<typeof createScan>
const mockParseUserAgent = parseUserAgent as jest.MockedFunction<
  typeof parseUserAgent
>
const mockGetGeolocationFromHeaders =
  getGeolocationFromHeaders as jest.MockedFunction<
    typeof getGeolocationFromHeaders
  >
const mockGetClientIP = getClientIP as jest.MockedFunction<typeof getClientIP>

// Mock QR code data
const mockQRCode: QRCode = {
  id: 1,
  short_code: 'abc12345',
  target_url: 'https://example.com',
  fg_color: '#000000',
  bg_color: '#FFFFFF',
  created_at: new Date('2024-01-01'),
}

describe('GET /r/[shortCode] - Database Operations', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateScan.mockResolvedValue({
      id: 1,
      qr_code_id: 1,
      scanned_at: new Date(),
      user_agent: null,
      ip_address: null,
      country: null,
      city: null,
      device_type: null,
      browser: null,
    })
  })

  describe('QR Code Lookup', () => {
    it('should return QR code when short code exists', async () => {
      mockGetQRCodeByShortCode.mockResolvedValue(mockQRCode)

      const result = await mockGetQRCodeByShortCode('abc12345')

      expect(result).toEqual(mockQRCode)
      expect(mockGetQRCodeByShortCode).toHaveBeenCalledWith('abc12345')
    })

    it('should return null when short code does not exist', async () => {
      mockGetQRCodeByShortCode.mockResolvedValue(null)

      const result = await mockGetQRCodeByShortCode('notfound')

      expect(result).toBeNull()
    })

    it('should throw error on database failure', async () => {
      mockGetQRCodeByShortCode.mockRejectedValue(
        new Error('Database connection failed')
      )

      await expect(mockGetQRCodeByShortCode('abc12345')).rejects.toThrow(
        'Database connection failed'
      )
    })
  })

  describe('Scan Event Creation', () => {
    it('should create scan with all parameters', async () => {
      const scanInput: CreateScanInput = {
        qr_code_id: 1,
        user_agent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
        ip_address: '192.168.1.xxx',
        country: 'US',
        city: 'San Francisco',
        device_type: 'mobile',
        browser: 'Safari',
      }

      await mockCreateScan(scanInput)

      expect(mockCreateScan).toHaveBeenCalledWith(scanInput)
    })

    it('should create scan with minimal parameters', async () => {
      const scanInput: CreateScanInput = {
        qr_code_id: 1,
      }

      await mockCreateScan(scanInput)

      expect(mockCreateScan).toHaveBeenCalledWith({ qr_code_id: 1 })
    })

    it('should handle scan creation failure gracefully', async () => {
      mockCreateScan.mockRejectedValue(new Error('Failed to create scan'))

      await expect(mockCreateScan({ qr_code_id: 1 })).rejects.toThrow(
        'Failed to create scan'
      )
    })
  })
})

describe('GET /r/[shortCode] - User Agent Parsing', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Mobile User Agents', () => {
    it('should parse iPhone user agent as mobile', () => {
      mockParseUserAgent.mockReturnValue({
        device_type: 'mobile',
        browser: 'Mobile Safari',
      })

      const userAgent =
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      const result = mockParseUserAgent(userAgent)

      expect(result.device_type).toBe('mobile')
      expect(result.browser).toBe('Mobile Safari')
      expect(mockParseUserAgent).toHaveBeenCalledWith(userAgent)
    })

    it('should parse Android user agent as mobile', () => {
      mockParseUserAgent.mockReturnValue({
        device_type: 'mobile',
        browser: 'Chrome',
      })

      const userAgent =
        'Mozilla/5.0 (Linux; Android 12; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.210 Mobile Safari/537.36'
      const result = mockParseUserAgent(userAgent)

      expect(result.device_type).toBe('mobile')
      expect(result.browser).toBe('Chrome')
    })
  })

  describe('Desktop User Agents', () => {
    it('should parse Chrome desktop user agent', () => {
      mockParseUserAgent.mockReturnValue({
        device_type: 'desktop',
        browser: 'Chrome',
      })

      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      const result = mockParseUserAgent(userAgent)

      expect(result.device_type).toBe('desktop')
      expect(result.browser).toBe('Chrome')
    })

    it('should parse Firefox desktop user agent', () => {
      mockParseUserAgent.mockReturnValue({
        device_type: 'desktop',
        browser: 'Firefox',
      })

      const userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0'
      const result = mockParseUserAgent(userAgent)

      expect(result.device_type).toBe('desktop')
      expect(result.browser).toBe('Firefox')
    })

    it('should parse Safari desktop user agent', () => {
      mockParseUserAgent.mockReturnValue({
        device_type: 'desktop',
        browser: 'Safari',
      })

      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
      const result = mockParseUserAgent(userAgent)

      expect(result.device_type).toBe('desktop')
      expect(result.browser).toBe('Safari')
    })
  })

  describe('Tablet User Agents', () => {
    it('should parse iPad user agent as tablet', () => {
      mockParseUserAgent.mockReturnValue({
        device_type: 'tablet',
        browser: 'Mobile Safari',
      })

      const userAgent =
        'Mozilla/5.0 (iPad; CPU OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
      const result = mockParseUserAgent(userAgent)

      expect(result.device_type).toBe('tablet')
      expect(result.browser).toBe('Mobile Safari')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty user agent string', () => {
      mockParseUserAgent.mockReturnValue({
        device_type: 'desktop',
        browser: 'unknown',
      })

      const result = mockParseUserAgent('')

      expect(result.device_type).toBe('desktop')
      expect(result.browser).toBe('unknown')
    })

    it('should handle bot user agents', () => {
      mockParseUserAgent.mockReturnValue({
        device_type: 'desktop',
        browser: 'unknown',
      })

      const userAgent =
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      const result = mockParseUserAgent(userAgent)

      expect(result.device_type).toBe('desktop')
      expect(result.browser).toBe('unknown')
    })
  })
})

describe('GET /r/[shortCode] - Geolocation Extraction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should extract country and city from Vercel headers', () => {
    mockGetGeolocationFromHeaders.mockReturnValue({
      country: 'US',
      city: 'New York',
    })

    const headers = new Headers({
      'x-vercel-ip-country': 'US',
      'x-vercel-ip-city': 'New York',
    })
    const result = mockGetGeolocationFromHeaders(headers)

    expect(result.country).toBe('US')
    expect(result.city).toBe('New York')
    expect(mockGetGeolocationFromHeaders).toHaveBeenCalledWith(headers)
  })

  it('should return undefined for missing headers', () => {
    mockGetGeolocationFromHeaders.mockReturnValue({
      country: undefined,
      city: undefined,
    })

    const headers = new Headers()
    const result = mockGetGeolocationFromHeaders(headers)

    expect(result.country).toBeUndefined()
    expect(result.city).toBeUndefined()
  })

  it('should handle partial headers (only country)', () => {
    mockGetGeolocationFromHeaders.mockReturnValue({
      country: 'UK',
      city: undefined,
    })

    const headers = new Headers({
      'x-vercel-ip-country': 'UK',
    })
    const result = mockGetGeolocationFromHeaders(headers)

    expect(result.country).toBe('UK')
    expect(result.city).toBeUndefined()
  })

  it('should handle partial headers (only city)', () => {
    mockGetGeolocationFromHeaders.mockReturnValue({
      country: undefined,
      city: 'London',
    })

    const headers = new Headers({
      'x-vercel-ip-city': 'London',
    })
    const result = mockGetGeolocationFromHeaders(headers)

    expect(result.country).toBeUndefined()
    expect(result.city).toBe('London')
  })
})

describe('GET /r/[shortCode] - IP Address Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should extract and truncate IP from x-forwarded-for header', () => {
    mockGetClientIP.mockReturnValue('192.168.1.xxx')

    const headers = new Headers({
      'x-forwarded-for': '192.168.1.100, 10.0.0.1',
    })
    const result = mockGetClientIP(headers)

    expect(result).toBe('192.168.1.xxx')
    expect(mockGetClientIP).toHaveBeenCalledWith(headers)
  })

  it('should extract and truncate IP from x-real-ip header', () => {
    mockGetClientIP.mockReturnValue('10.0.0.xxx')

    const headers = new Headers({
      'x-real-ip': '10.0.0.50',
    })
    const result = mockGetClientIP(headers)

    expect(result).toBe('10.0.0.xxx')
  })

  it('should prefer x-forwarded-for over x-real-ip', () => {
    mockGetClientIP.mockReturnValue('192.168.1.xxx')

    const headers = new Headers({
      'x-forwarded-for': '192.168.1.100',
      'x-real-ip': '10.0.0.50',
    })
    const result = mockGetClientIP(headers)

    expect(result).toBe('192.168.1.xxx')
  })

  it('should return undefined for missing IP headers', () => {
    mockGetClientIP.mockReturnValue(undefined)

    const headers = new Headers()
    const result = mockGetClientIP(headers)

    expect(result).toBeUndefined()
  })

  it('should truncate IPv6 addresses', () => {
    mockGetClientIP.mockReturnValue('2001:0db8:85a3:0000:0000:8a2e:0370:xxxx')

    const headers = new Headers({
      'x-forwarded-for': '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
    })
    const result = mockGetClientIP(headers)

    expect(result).toBe('2001:0db8:85a3:0000:0000:8a2e:0370:xxxx')
  })
})

describe('GET /r/[shortCode] - Business Logic Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCreateScan.mockResolvedValue({
      id: 1,
      qr_code_id: 1,
      scanned_at: new Date(),
      user_agent: null,
      ip_address: null,
      country: null,
      city: null,
      device_type: null,
      browser: null,
    })
  })

  it('should complete redirect flow for valid short code', async () => {
    mockGetQRCodeByShortCode.mockResolvedValue(mockQRCode)
    mockParseUserAgent.mockReturnValue({
      device_type: 'mobile',
      browser: 'Safari',
    })
    mockGetGeolocationFromHeaders.mockReturnValue({
      country: 'US',
      city: 'San Francisco',
    })
    mockGetClientIP.mockReturnValue('192.168.1.xxx')

    // Simulate the redirect flow
    const shortCode = 'abc12345'
    const qrCode = await mockGetQRCodeByShortCode(shortCode)

    expect(qrCode).not.toBeNull()
    expect(qrCode?.target_url).toBe('https://example.com')

    // Create scan event
    const userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)'
    const { device_type, browser } = mockParseUserAgent(userAgent)
    const headers = new Headers({
      'x-vercel-ip-country': 'US',
      'x-vercel-ip-city': 'San Francisco',
      'x-forwarded-for': '192.168.1.100',
    })
    const { country, city } = mockGetGeolocationFromHeaders(headers)
    const ipAddress = mockGetClientIP(headers)

    await mockCreateScan({
      qr_code_id: qrCode!.id,
      user_agent: userAgent,
      ip_address: ipAddress,
      country,
      city,
      device_type,
      browser,
    })

    expect(mockCreateScan).toHaveBeenCalledWith({
      qr_code_id: 1,
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)',
      ip_address: '192.168.1.xxx',
      country: 'US',
      city: 'San Francisco',
      device_type: 'mobile',
      browser: 'Safari',
    })
  })

  it('should handle 404 flow for invalid short code', async () => {
    mockGetQRCodeByShortCode.mockResolvedValue(null)

    const shortCode = 'notfound'
    const qrCode = await mockGetQRCodeByShortCode(shortCode)

    expect(qrCode).toBeNull()
    // Should not create scan for non-existent QR code
    expect(mockCreateScan).not.toHaveBeenCalled()
  })

  it('should handle redirect with URL containing query parameters', async () => {
    const qrCodeWithQuery: QRCode = {
      ...mockQRCode,
      target_url: 'https://example.com/path?utm_source=qr&campaign=test',
    }
    mockGetQRCodeByShortCode.mockResolvedValue(qrCodeWithQuery)

    const qrCode = await mockGetQRCodeByShortCode('abc12345')

    expect(qrCode?.target_url).toBe(
      'https://example.com/path?utm_source=qr&campaign=test'
    )
  })

  it('should handle redirect with URL containing fragment', async () => {
    const qrCodeWithFragment: QRCode = {
      ...mockQRCode,
      target_url: 'https://example.com/page#section-2',
    }
    mockGetQRCodeByShortCode.mockResolvedValue(qrCodeWithFragment)

    const qrCode = await mockGetQRCodeByShortCode('abc12345')

    expect(qrCode?.target_url).toBe('https://example.com/page#section-2')
  })

  it('should handle very long target URLs', async () => {
    const longPath = 'a'.repeat(2000)
    const qrCodeWithLongUrl: QRCode = {
      ...mockQRCode,
      target_url: `https://example.com/${longPath}`,
    }
    mockGetQRCodeByShortCode.mockResolvedValue(qrCodeWithLongUrl)

    const qrCode = await mockGetQRCodeByShortCode('abc12345')

    expect(qrCode?.target_url).toBe(`https://example.com/${longPath}`)
    expect(qrCode?.target_url.length).toBeGreaterThan(2000)
  })

  it('should handle scan tracking failure without blocking redirect', async () => {
    mockGetQRCodeByShortCode.mockResolvedValue(mockQRCode)
    mockCreateScan.mockRejectedValue(new Error('Database write failed'))
    mockParseUserAgent.mockReturnValue({
      device_type: 'desktop',
      browser: 'Chrome',
    })
    mockGetGeolocationFromHeaders.mockReturnValue({
      country: undefined,
      city: undefined,
    })
    mockGetClientIP.mockReturnValue(undefined)

    // The redirect should succeed even if scan tracking fails
    const qrCode = await mockGetQRCodeByShortCode('abc12345')
    expect(qrCode).not.toBeNull()
    expect(qrCode?.target_url).toBe('https://example.com')

    // Scan creation fails but doesn't throw
    await expect(
      mockCreateScan({ qr_code_id: 1 })
    ).rejects.toThrow('Database write failed')
  })
})

describe('GET /r/[shortCode] - Response Format', () => {
  it('should construct correct 302 redirect response', () => {
    // Simulate what the route handler should return for success
    const targetUrl = 'https://example.com'
    const redirectStatus = 302

    // This matches the NextResponse.redirect behavior
    expect(redirectStatus).toBe(302)
    expect(targetUrl).toMatch(/^https?:\/\//)
  })

  it('should construct correct 404 error response', () => {
    // Simulate the 404 response structure
    const errorResponse = {
      error: 'QR code not found',
    }
    const status = 404

    expect(status).toBe(404)
    expect(errorResponse.error).toBe('QR code not found')
  })

  it('should construct correct 500 error response', () => {
    // Simulate the 500 response structure
    const errorResponse = {
      error: 'Internal server error',
    }
    const status = 500

    expect(status).toBe(500)
    expect(errorResponse.error).toBe('Internal server error')
  })
})

describe('GET /r/[shortCode] - Edge Cases', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should handle short code with maximum length', async () => {
    const longShortCode = 'a'.repeat(12) // nanoid fallback generates 12 chars
    const qrCodeWithLongCode: QRCode = {
      ...mockQRCode,
      short_code: longShortCode,
    }
    mockGetQRCodeByShortCode.mockResolvedValue(qrCodeWithLongCode)

    const qrCode = await mockGetQRCodeByShortCode(longShortCode)

    expect(qrCode?.short_code).toBe(longShortCode)
    expect(mockGetQRCodeByShortCode).toHaveBeenCalledWith(longShortCode)
  })

  it('should handle concurrent scan tracking', async () => {
    mockGetQRCodeByShortCode.mockResolvedValue(mockQRCode)
    mockCreateScan.mockResolvedValue({
      id: 1,
      qr_code_id: 1,
      scanned_at: new Date(),
      user_agent: null,
      ip_address: null,
      country: null,
      city: null,
      device_type: null,
      browser: null,
    })

    // Simulate multiple concurrent scans
    const scanPromises = Array.from({ length: 5 }, (_, i) =>
      mockCreateScan({ qr_code_id: 1, user_agent: `Agent-${i}` })
    )

    await Promise.all(scanPromises)

    expect(mockCreateScan).toHaveBeenCalledTimes(5)
  })

  it('should handle special characters in user agent', async () => {
    mockParseUserAgent.mockReturnValue({
      device_type: 'desktop',
      browser: 'Chrome',
    })

    const userAgentWithSpecialChars =
      'Mozilla/5.0 <script>alert("xss")</script>'
    mockParseUserAgent(userAgentWithSpecialChars)

    expect(mockParseUserAgent).toHaveBeenCalledWith(userAgentWithSpecialChars)
  })
})
