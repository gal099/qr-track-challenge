import { generateQRCodeSchema } from '../validations'

describe('generateQRCodeSchema', () => {
  describe('target_url validation', () => {
    it('should pass with a valid HTTPS URL', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with a valid HTTP URL', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'http://example.com',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with URL containing query parameters', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com/path?query=value&foo=bar',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with URL containing fragment', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com/path#section',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with URL containing query parameters and fragment', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com/path?query=value#section',
      })
      expect(result.success).toBe(true)
    })

    it('should fail with missing protocol', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'example.com',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Please enter a valid URL (e.g., https://example.com)')
      }
    })

    it('should fail with malformed URL', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'not-a-url',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Please enter a valid URL (e.g., https://example.com)')
      }
    })

    it('should fail with empty URL', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('URL is required')
      }
    })

    it('should fail with missing target_url', () => {
      const result = generateQRCodeSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe('fg_color validation', () => {
    it('should pass with valid lowercase hex color', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: '#000000',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with valid uppercase hex color', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: '#FFFFFF',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with valid mixed case hex color', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: '#AbCdEf',
      })
      expect(result.success).toBe(true)
    })

    it('should fail with hex color missing #', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: '000000',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Foreground color must be a valid hex color (e.g., #000000)')
      }
    })

    it('should fail with 3-character hex color', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: '#FFF',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Foreground color must be a valid hex color (e.g., #000000)')
      }
    })

    it('should fail with 8-character hex color', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: '#00000000',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Foreground color must be a valid hex color (e.g., #000000)')
      }
    })

    it('should fail with invalid characters in hex color', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        fg_color: '#GGGGGG',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Foreground color must be a valid hex color (e.g., #000000)')
      }
    })

    it('should default to #000000 when fg_color is omitted', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.fg_color).toBe('#000000')
      }
    })
  })

  describe('bg_color validation', () => {
    it('should pass with valid hex color', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        bg_color: '#FFFFFF',
      })
      expect(result.success).toBe(true)
    })

    it('should fail with invalid hex color format', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        bg_color: 'red',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Background color must be a valid hex color (e.g., #FFFFFF)')
      }
    })

    it('should default to #FFFFFF when bg_color is omitted', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.bg_color).toBe('#FFFFFF')
      }
    })
  })

  describe('combined validation', () => {
    it('should apply both default colors when omitted', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.fg_color).toBe('#000000')
        expect(result.data.bg_color).toBe('#FFFFFF')
      }
    })

    it('should pass with all valid fields', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com/path?query=value',
        fg_color: '#123456',
        bg_color: '#ABCDEF',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.target_url).toBe(
          'https://example.com/path?query=value'
        )
        expect(result.data.fg_color).toBe('#123456')
        expect(result.data.bg_color).toBe('#ABCDEF')
      }
    })
  })
})
