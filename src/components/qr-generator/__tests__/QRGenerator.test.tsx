// Mock nanoid before importing the component
jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'test1234'),
}))

// Mock db module
jest.mock('@/lib/db', () => ({
  shortCodeExists: jest.fn(() => Promise.resolve(false)),
}))

import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import QRGenerator from '../QRGenerator'

// Mock the qrcode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockQRCode'),
}))

// Mock the fetch API
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock navigator.clipboard
const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
}
Object.assign(navigator, {
  clipboard: mockClipboard,
})

describe('QRGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Initial render', () => {
    it('should render URL input field with correct label', () => {
      render(<QRGenerator />)

      expect(screen.getByLabelText('Target URL')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('https://example.com')).toBeInTheDocument()
    })

    it('should render foreground color picker button showing #000000', () => {
      render(<QRGenerator />)

      expect(screen.getByText('Foreground Color')).toBeInTheDocument()
      expect(screen.getByText('#000000')).toBeInTheDocument()
    })

    it('should render background color picker button showing #FFFFFF', () => {
      render(<QRGenerator />)

      expect(screen.getByText('Background Color')).toBeInTheDocument()
      expect(screen.getByText('#FFFFFF')).toBeInTheDocument()
    })

    it('should render Generate button disabled when URL is empty', () => {
      render(<QRGenerator />)

      const button = screen.getByRole('button', { name: /generate qr code/i })
      expect(button).toBeDisabled()
    })

    it('should show preview placeholder message', () => {
      render(<QRGenerator />)

      expect(screen.getByText('Enter a valid URL to see preview')).toBeInTheDocument()
    })
  })

  describe('URL input', () => {
    it('should allow user to type in the URL input', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')
      await user.type(input, 'https://example.com')

      expect(input).toHaveValue('https://example.com')
    })

    it('should enable Generate button with valid URL', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')
      await user.type(input, 'https://example.com')

      const button = screen.getByRole('button', { name: /generate qr code/i })
      expect(button).toBeEnabled()
    })
  })

  describe('Color pickers', () => {
    it('should open foreground color picker when clicking the button', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<QRGenerator />)

      const fgButton = screen.getAllByRole('button')[0]
      await user.click(fgButton)

      // The HexColorPicker component should be visible (react-colorful creates a div with specific class)
      const colorPicker = document.querySelector('.react-colorful')
      expect(colorPicker).toBeInTheDocument()
    })

    it('should open background color picker when clicking the button', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<QRGenerator />)

      const bgButton = screen.getAllByRole('button')[1]
      await user.click(bgButton)

      const colorPicker = document.querySelector('.react-colorful')
      expect(colorPicker).toBeInTheDocument()
    })

    it('should close foreground color picker when clicking outside', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<QRGenerator />)

      // Open the picker
      const fgButton = screen.getAllByRole('button')[0]
      await user.click(fgButton)

      // Color picker should be visible
      expect(document.querySelector('.react-colorful')).toBeInTheDocument()

      // Click the backdrop (fixed inset-0 div)
      const backdrop = document.querySelector('.fixed.inset-0')
      if (backdrop) {
        await user.click(backdrop)
      }

      // Color picker should be closed
      await waitFor(() => {
        expect(document.querySelector('.react-colorful')).not.toBeInTheDocument()
      })
    })
  })

  describe('Real-time preview', () => {
    it('should generate preview when valid URL is entered after debounce', async () => {
      const QRCode = require('qrcode')
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')
      await user.type(input, 'https://example.com')

      // Advance timers past debounce delay
      await act(async () => {
        jest.advanceTimersByTime(350)
      })

      await waitFor(() => {
        expect(QRCode.toDataURL).toHaveBeenCalledWith('https://example.com', {
          color: { dark: '#000000', light: '#FFFFFF' },
          width: 256,
          margin: 2,
        })
      })

      // Preview image should be displayed
      await waitFor(() => {
        expect(screen.getByAltText('QR Code Preview')).toBeInTheDocument()
      })
    })

    it('should not generate preview for invalid URL', async () => {
      const QRCode = require('qrcode')
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')
      await user.type(input, 'not-a-url')

      // Advance timers past debounce delay
      await act(async () => {
        jest.advanceTimersByTime(350)
      })

      // toDataURL should not have been called
      expect(QRCode.toDataURL).not.toHaveBeenCalled()

      // Placeholder should still be shown
      expect(screen.getByText('Enter a valid URL to see preview')).toBeInTheDocument()
    })

    it('should clear preview when URL becomes invalid', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')

      // Enter valid URL
      await user.type(input, 'https://example.com')
      await act(async () => {
        jest.advanceTimersByTime(350)
      })

      // Preview should be shown
      await waitFor(() => {
        expect(screen.getByAltText('QR Code Preview')).toBeInTheDocument()
      })

      // Clear the input
      await user.clear(input)
      await act(async () => {
        jest.advanceTimersByTime(350)
      })

      // Placeholder should be shown again
      await waitFor(() => {
        expect(screen.getByText('Enter a valid URL to see preview')).toBeInTheDocument()
      })
    })
  })

  describe('Form submission', () => {
    it('should call API when Generate button is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              qr_code_data_url: 'data:image/png;base64,generatedQR',
              short_url: 'http://localhost:3000/r/abc123',
              analytics_url: 'http://localhost:3000/analytics/1',
            },
          }),
      })

      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')
      await user.type(input, 'https://example.com')

      const generateButton = screen.getByRole('button', { name: /generate qr code/i })
      await user.click(generateButton)

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/qr/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            target_url: 'https://example.com',
            fg_color: '#000000',
            bg_color: '#FFFFFF',
          }),
        })
      })
    })

    it('should show loading state during API call', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      let resolvePromise: (value: unknown) => void
      mockFetch.mockReturnValueOnce(
        new Promise((resolve) => {
          resolvePromise = resolve
        })
      )

      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')
      await user.type(input, 'https://example.com')

      const generateButton = screen.getByRole('button', { name: /generate qr code/i })
      await user.click(generateButton)

      expect(screen.getByRole('button', { name: /generating.../i })).toBeInTheDocument()

      // Resolve the promise
      await act(async () => {
        resolvePromise!({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              data: {
                qr_code_data_url: 'data:image/png;base64,test',
                short_url: 'http://localhost:3000/r/abc123',
                analytics_url: 'http://localhost:3000/analytics/1',
              },
            }),
        })
      })
    })

    it('should display result section on success', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              qr_code_data_url: 'data:image/png;base64,generatedQR',
              short_url: 'http://localhost:3000/r/abc123',
              analytics_url: 'http://localhost:3000/analytics/1',
            },
          }),
      })

      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')
      await user.type(input, 'https://example.com')

      const generateButton = screen.getByRole('button', { name: /generate qr code/i })
      await user.click(generateButton)

      await waitFor(() => {
        expect(screen.getByAltText('Generated QR Code')).toBeInTheDocument()
        expect(screen.getByDisplayValue('http://localhost:3000/r/abc123')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /download png/i })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /view analytics/i })).toBeInTheDocument()
      })
    })

    it('should display error message on API failure', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            success: false,
            error: 'Invalid input data',
          }),
      })

      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')
      await user.type(input, 'https://example.com')

      const generateButton = screen.getByRole('button', { name: /generate qr code/i })
      await user.click(generateButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid input data')).toBeInTheDocument()
      })
    })
  })

  describe('Copy and Download', () => {
    it('should have Copy button in result section', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              qr_code_data_url: 'data:image/png;base64,generatedQR',
              short_url: 'http://localhost:3000/r/abc123',
              analytics_url: 'http://localhost:3000/analytics/1',
            },
          }),
      })

      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')
      await user.type(input, 'https://example.com')

      const generateButton = screen.getByRole('button', { name: /generate qr code/i })
      await user.click(generateButton)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
      })

      // Verify the Copy button is present and clickable
      const copyButton = screen.getByRole('button', { name: /copy/i })
      expect(copyButton).toBeEnabled()
    })

    it('should have View Analytics link with correct href', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
              qr_code_data_url: 'data:image/png;base64,generatedQR',
              short_url: 'http://localhost:3000/r/abc123',
              analytics_url: 'http://localhost:3000/analytics/1',
            },
          }),
      })

      render(<QRGenerator />)

      const input = screen.getByLabelText('Target URL')
      await user.type(input, 'https://example.com')

      const generateButton = screen.getByRole('button', { name: /generate qr code/i })
      await user.click(generateButton)

      await waitFor(() => {
        const analyticsLink = screen.getByRole('link', { name: /view analytics/i })
        expect(analyticsLink).toHaveAttribute('href', 'http://localhost:3000/analytics/1')
        expect(analyticsLink).toHaveAttribute('target', '_blank')
      })
    })
  })
})
