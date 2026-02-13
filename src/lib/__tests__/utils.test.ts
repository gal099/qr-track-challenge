// Mock nanoid before importing utils
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'test1234'),
}))

// Mock db module since utils imports it
jest.mock('../db', () => ({
  shortCodeExists: jest.fn(() => Promise.resolve(false)),
}))

import {
  isValidUrl,
  isValidHexColor,
  parseUserAgent,
  getGeolocationFromHeaders,
} from '../utils'

describe('isValidUrl', () => {
  describe('valid URLs', () => {
    it('should return true for valid HTTP URL', () => {
      expect(isValidUrl('http://example.com')).toBe(true)
    })

    it('should return true for valid HTTPS URL', () => {
      expect(isValidUrl('https://example.com')).toBe(true)
    })

    it('should return true for URL with path', () => {
      expect(isValidUrl('https://example.com/path/to/page')).toBe(true)
    })

    it('should return true for URL with query parameters', () => {
      expect(isValidUrl('https://example.com?foo=bar&baz=qux')).toBe(true)
    })

    it('should return true for URL with fragment', () => {
      expect(isValidUrl('https://example.com#section')).toBe(true)
    })

    it('should return true for URL with port', () => {
      expect(isValidUrl('https://example.com:8080')).toBe(true)
    })

    it('should return true for localhost URL', () => {
      expect(isValidUrl('http://localhost:3000')).toBe(true)
    })

    it('should return true for URL with subdomain', () => {
      expect(isValidUrl('https://www.example.com')).toBe(true)
    })
  })

  describe('invalid URLs', () => {
    it('should return false for FTP protocol', () => {
      expect(isValidUrl('ftp://example.com')).toBe(false)
    })

    it('should return false for file protocol', () => {
      expect(isValidUrl('file:///path/to/file')).toBe(false)
    })

    it('should return false for mailto protocol', () => {
      expect(isValidUrl('mailto:test@example.com')).toBe(false)
    })

    it('should return false for javascript protocol', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false)
    })

    it('should return false for malformed URL', () => {
      expect(isValidUrl('not-a-url')).toBe(false)
    })

    it('should return false for URL without protocol', () => {
      expect(isValidUrl('example.com')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isValidUrl('')).toBe(false)
    })

    it('should return false for just protocol', () => {
      expect(isValidUrl('https://')).toBe(false)
    })
  })
})

describe('isValidHexColor', () => {
  describe('valid hex colors', () => {
    it('should return true for black (#000000)', () => {
      expect(isValidHexColor('#000000')).toBe(true)
    })

    it('should return true for white (#FFFFFF)', () => {
      expect(isValidHexColor('#FFFFFF')).toBe(true)
    })

    it('should return true for lowercase hex color', () => {
      expect(isValidHexColor('#abcdef')).toBe(true)
    })

    it('should return true for mixed case hex color', () => {
      expect(isValidHexColor('#AbCdEf')).toBe(true)
    })

    it('should return true for arbitrary valid color', () => {
      expect(isValidHexColor('#123456')).toBe(true)
    })
  })

  describe('invalid hex colors', () => {
    it('should return false for hex color without #', () => {
      expect(isValidHexColor('000000')).toBe(false)
    })

    it('should return false for 3-character hex color', () => {
      expect(isValidHexColor('#FFF')).toBe(false)
    })

    it('should return false for 8-character hex color (with alpha)', () => {
      expect(isValidHexColor('#00000000')).toBe(false)
    })

    it('should return false for invalid characters', () => {
      expect(isValidHexColor('#GGGGGG')).toBe(false)
    })

    it('should return false for named color', () => {
      expect(isValidHexColor('red')).toBe(false)
    })

    it('should return false for RGB format', () => {
      expect(isValidHexColor('rgb(0,0,0)')).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isValidHexColor('')).toBe(false)
    })

    it('should return false for just #', () => {
      expect(isValidHexColor('#')).toBe(false)
    })

    it('should return false for too short hex', () => {
      expect(isValidHexColor('#12345')).toBe(false)
    })

    it('should return false for too long hex', () => {
      expect(isValidHexColor('#1234567')).toBe(false)
    })
  })
})

describe('parseUserAgent', () => {
  describe('device type detection', () => {
    it('should return mobile for iPhone user agent', () => {
      const result = parseUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1'
      )
      expect(result.device_type).toBe('mobile')
    })

    it('should return mobile for Android phone user agent', () => {
      const result = parseUserAgent(
        'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36'
      )
      expect(result.device_type).toBe('mobile')
    })

    it('should return tablet for iPad user agent', () => {
      const result = parseUserAgent(
        'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A5341f Safari/604.1'
      )
      expect(result.device_type).toBe('tablet')
    })

    it('should return desktop for Windows Chrome user agent', () => {
      const result = parseUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      )
      expect(result.device_type).toBe('desktop')
    })

    it('should return desktop for Mac Safari user agent', () => {
      const result = parseUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
      )
      expect(result.device_type).toBe('desktop')
    })

    it('should return desktop for empty user agent', () => {
      const result = parseUserAgent('')
      expect(result.device_type).toBe('desktop')
    })

    it('should return desktop for unknown user agent', () => {
      const result = parseUserAgent('unknown-agent')
      expect(result.device_type).toBe('desktop')
    })
  })

  describe('browser detection', () => {
    it('should detect Chrome browser', () => {
      const result = parseUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      )
      expect(result.browser).toBe('Chrome')
    })

    it('should detect Firefox browser', () => {
      const result = parseUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0'
      )
      expect(result.browser).toBe('Firefox')
    })

    it('should detect Safari browser', () => {
      const result = parseUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15'
      )
      expect(result.browser).toBe('Safari')
    })

    it('should detect Edge browser', () => {
      const result = parseUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59'
      )
      expect(result.browser).toBe('Edge')
    })

    it('should detect Mobile Safari', () => {
      const result = parseUserAgent(
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1'
      )
      expect(result.browser).toBe('Mobile Safari')
    })

    it('should handle empty user agent', () => {
      const result = parseUserAgent('')
      // UA parser may return "WebKit" or "unknown" for empty strings
      expect(['unknown', 'WebKit']).toContain(result.browser)
    })

    it('should handle unrecognized user agent', () => {
      const result = parseUserAgent('unknown-agent')
      // UA parser may return "unknown" or some partial match
      expect(typeof result.browser).toBe('string')
    })
  })
})

describe('getGeolocationFromHeaders', () => {
  // Helper function to create Headers object
  const createHeaders = (
    city?: string,
    country?: string
  ): Headers => {
    const headers = new Headers()
    if (city !== undefined) headers.set('x-vercel-ip-city', city)
    if (country !== undefined) headers.set('x-vercel-ip-country', country)
    return headers
  }

  describe('city name decoding', () => {
    it('should decode URL-encoded city names with special characters', () => {
      const headers = createHeaders('General%20Fern%C3%A1ndez%20Oro', 'AR')
      const result = getGeolocationFromHeaders(headers)
      expect(result.city).toBe('General Fernández Oro')
      expect(result.country).toBe('AR')
    })

    it('should decode URL-encoded city names with spaces', () => {
      const headers = createHeaders('Tres%20Arroyos', 'AR')
      const result = getGeolocationFromHeaders(headers)
      expect(result.city).toBe('Tres Arroyos')
    })

    it('should decode URL-encoded city with multiple special characters', () => {
      const headers = createHeaders('S%C3%A3o%20Paulo', 'BR')
      const result = getGeolocationFromHeaders(headers)
      expect(result.city).toBe('São Paulo')
    })

    it('should pass through simple city names without encoding', () => {
      const headers = createHeaders('Tokyo', 'JP')
      const result = getGeolocationFromHeaders(headers)
      expect(result.city).toBe('Tokyo')
    })

    it('should handle city names that are already decoded', () => {
      const headers = createHeaders('New York', 'US')
      const result = getGeolocationFromHeaders(headers)
      expect(result.city).toBe('New York')
    })

    it('should handle malformed encoding gracefully', () => {
      // Invalid percent encoding should return original value
      const headers = createHeaders('Invalid%Encoding', 'US')
      const result = getGeolocationFromHeaders(headers)
      expect(result.city).toBe('Invalid%Encoding')
    })

    it('should return undefined for missing city header', () => {
      const headers = createHeaders(undefined, 'US')
      const result = getGeolocationFromHeaders(headers)
      expect(result.city).toBeUndefined()
    })

    it('should return undefined for both when no headers are set', () => {
      const headers = new Headers()
      const result = getGeolocationFromHeaders(headers)
      expect(result.city).toBeUndefined()
      expect(result.country).toBeUndefined()
    })
  })

  describe('country handling', () => {
    it('should return country code without modification', () => {
      const headers = createHeaders('Buenos%20Aires', 'AR')
      const result = getGeolocationFromHeaders(headers)
      expect(result.country).toBe('AR')
    })

    it('should return undefined for missing country header', () => {
      const headers = createHeaders('Tokyo')
      const result = getGeolocationFromHeaders(headers)
      expect(result.country).toBeUndefined()
    })
  })
})
