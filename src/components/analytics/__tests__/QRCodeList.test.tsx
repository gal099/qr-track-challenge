import { render, screen, waitFor } from '@testing-library/react'
import QRCodeList from '../QRCodeList'

// Mock the fetch API
const mockFetch = jest.fn()
global.fetch = mockFetch

const mockQRCodes = [
  {
    id: 1,
    short_code: 'abc123',
    target_url: 'https://example.com',
    fg_color: '#000000',
    bg_color: '#FFFFFF',
    created_at: '2024-01-15T10:00:00.000Z',
    total_scans: 42,
  },
  {
    id: 2,
    short_code: 'def456',
    target_url: 'https://very-long-url-that-should-be-truncated-in-the-display.com/path/to/something',
    fg_color: '#FF0000',
    bg_color: '#00FF00',
    created_at: '2024-01-10T08:30:00.000Z',
    total_scans: 0,
  },
]

describe('QRCodeList', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Loading state', () => {
    it('should render loading skeleton state initially', () => {
      mockFetch.mockReturnValue(new Promise(() => {}))
      render(<QRCodeList />)

      // Check for skeleton loading indicators (animate-pulse elements)
      const skeletonElements = document.querySelectorAll('.animate-pulse')
      expect(skeletonElements.length).toBeGreaterThan(0)
    })
  })

  describe('Error state', () => {
    it('should display error message when API fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            success: false,
            error: 'Failed to fetch QR codes',
          }),
      })

      render(<QRCodeList />)

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch QR codes')).toBeInTheDocument()
      })
    })

    it('should display error message on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(<QRCodeList />)

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })
  })

  describe('Empty state', () => {
    it('should display empty state when no QR codes exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { qr_codes: [] },
          }),
      })

      render(<QRCodeList />)

      await waitFor(() => {
        expect(screen.getByText('No QR codes found.')).toBeInTheDocument()
        expect(screen.getByText('Generate your first QR code')).toBeInTheDocument()
      })
    })

    it('should have link to home page in empty state', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { qr_codes: [] },
          }),
      })

      render(<QRCodeList />)

      await waitFor(() => {
        const link = screen.getByRole('link', { name: /generate your first qr code/i })
        expect(link).toHaveAttribute('href', '/')
      })
    })
  })

  describe('QR Code cards', () => {
    it('should render QR code cards with correct data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { qr_codes: mockQRCodes },
          }),
      })

      render(<QRCodeList />)

      await waitFor(() => {
        // Check short codes are displayed
        expect(screen.getByText('abc123')).toBeInTheDocument()
        expect(screen.getByText('def456')).toBeInTheDocument()

        // Check target URL (first one is short enough to display fully)
        expect(screen.getByText('https://example.com')).toBeInTheDocument()

        // Check total scans
        expect(screen.getByText('42')).toBeInTheDocument()
        expect(screen.getByText('0')).toBeInTheDocument()

        // Check "total scans" labels exist
        const scanLabels = screen.getAllByText('total scans')
        expect(scanLabels).toHaveLength(2)
      })
    })

    it('should truncate long URLs', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { qr_codes: mockQRCodes },
          }),
      })

      render(<QRCodeList />)

      await waitFor(() => {
        // The long URL should be truncated with "..."
        expect(screen.getByText(/https:\/\/very-long-url.*\.\.\./)).toBeInTheDocument()
      })
    })

    it('should have correct navigation links to individual analytics', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { qr_codes: mockQRCodes },
          }),
      })

      render(<QRCodeList />)

      await waitFor(() => {
        const links = screen.getAllByRole('link')
        expect(links[0]).toHaveAttribute('href', '/analytics/1')
        expect(links[1]).toHaveAttribute('href', '/analytics/2')
      })
    })

    it('should display formatted creation dates', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { qr_codes: mockQRCodes },
          }),
      })

      render(<QRCodeList />)

      await waitFor(() => {
        // date-fns format 'MMM d, yyyy'
        expect(screen.getByText('Jan 15, 2024')).toBeInTheDocument()
        expect(screen.getByText('Jan 10, 2024')).toBeInTheDocument()
      })
    })

    it('should display View Analytics link on each card', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: { qr_codes: mockQRCodes },
          }),
      })

      render(<QRCodeList />)

      await waitFor(() => {
        const viewLinks = screen.getAllByText('View Analytics →')
        expect(viewLinks).toHaveLength(2)
      })
    })
  })
})
