import { generateQRCodeSchema } from '../validations'

describe('generateQRCodeSchema', () => {
  describe('target_url validation', () => {
    it('should pass with a valid HTTPS URL', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'John Doe',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with a valid HTTP URL', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'http://example.com',
        author: 'John Doe',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with URL containing query parameters', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com/path?query=value&foo=bar',
        author: 'John Doe',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with URL containing fragment', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com/path#section',
        author: 'John Doe',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with URL containing query parameters and fragment', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com/path?query=value#section',
        author: 'John Doe',
      })
      expect(result.success).toBe(true)
    })

    it('should fail with missing protocol', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'example.com',
        author: 'John Doe',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Please enter a valid URL (e.g., https://example.com)')
      }
    })

    it('should fail with malformed URL', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'not-a-url',
        author: 'John Doe',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Please enter a valid URL (e.g., https://example.com)')
      }
    })

    it('should fail with empty URL', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: '',
        author: 'John Doe',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('URL is required')
      }
    })

    it('should fail with missing target_url', () => {
      const result = generateQRCodeSchema.safeParse({
        author: 'John Doe',
      })
      expect(result.success).toBe(false)
    })
  })

  describe('author validation', () => {
    it('should pass with a valid author name', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'John Doe',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.author).toBe('John Doe')
      }
    })

    it('should pass with author containing numbers', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'User123',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.author).toBe('User123')
      }
    })

    it('should pass with minimum length author (2 characters)', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'Jo',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with maximum length author (30 characters)', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'A'.repeat(30),
      })
      expect(result.success).toBe(true)
    })

    it('should trim whitespace from author', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: '  John Doe  ',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.author).toBe('John Doe')
      }
    })

    it('should fail with empty author', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: '',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Author is required')
      }
    })

    it('should fail with missing author', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
      })
      expect(result.success).toBe(false)
    })

    it('should fail with single character author', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'A',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Author must be at least 2 characters')
      }
    })

    it('should fail with author exceeding 30 characters', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'A'.repeat(31),
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Author must be at most 30 characters')
      }
    })

    it('should fail with special characters in author', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'Test@User#123',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Author can only contain letters, numbers, and spaces')
      }
    })

    it('should fail with only spaces as author', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: '   ',
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Author must be at least 2 characters')
      }
    })
  })

  describe('fg_color validation', () => {
    it('should pass with valid lowercase hex color', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'John Doe',
        fg_color: '#000000',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with valid uppercase hex color', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'John Doe',
        fg_color: '#FFFFFF',
      })
      expect(result.success).toBe(true)
    })

    it('should pass with valid mixed case hex color', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'John Doe',
        fg_color: '#AbCdEf',
      })
      expect(result.success).toBe(true)
    })

    it('should fail with hex color missing #', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'John Doe',
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
        author: 'John Doe',
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
        author: 'John Doe',
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
        author: 'John Doe',
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
        author: 'John Doe',
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
        author: 'John Doe',
        bg_color: '#FFFFFF',
      })
      expect(result.success).toBe(true)
    })

    it('should fail with invalid hex color format', () => {
      const result = generateQRCodeSchema.safeParse({
        target_url: 'https://example.com',
        author: 'John Doe',
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
        author: 'John Doe',
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
        author: 'John Doe',
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
        author: 'John Doe',
        fg_color: '#123456',
        bg_color: '#ABCDEF',
      })
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.target_url).toBe(
          'https://example.com/path?query=value'
        )
        expect(result.data.author).toBe('John Doe')
        expect(result.data.fg_color).toBe('#123456')
        expect(result.data.bg_color).toBe('#ABCDEF')
      }
    })
  })
})
