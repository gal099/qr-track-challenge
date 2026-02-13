import { render, screen, waitFor, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AnalyticsDashboard from '../AnalyticsDashboard'

// Mock recharts to avoid rendering issues in tests
jest.mock('recharts', () => ({
  LineChart: () => <div data-testid="line-chart">LineChart</div>,
  Line: () => null,
  BarChart: () => <div data-testid="bar-chart">BarChart</div>,
  Bar: () => null,
  PieChart: () => <div data-testid="pie-chart">PieChart</div>,
  Pie: () => null,
  Cell: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}))

// Mock the fetch API
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock navigator.clipboard before any tests run
const mockWriteText = jest.fn().mockResolvedValue(undefined)
const originalClipboard = navigator.clipboard

const mockAnalyticsData = {
  qr_code: {
    id: 1,
    short_code: 'abc123',
    target_url: 'https://example.com',
    created_at: '2024-01-15T10:00:00.000Z',
  },
  analytics: {
    total_scans: 150,
    scans_by_date: [
      { date: '2024-01-10', count: 50 },
      { date: '2024-01-11', count: 75 },
      { date: '2024-01-12', count: 25 },
    ],
    device_breakdown: [
      { device_type: 'mobile', count: 80 },
      { device_type: 'desktop', count: 60 },
      { device_type: 'tablet', count: 10 },
    ],
    browser_breakdown: [
      { browser: 'Chrome', count: 90 },
      { browser: 'Safari', count: 40 },
      { browser: 'Firefox', count: 20 },
    ],
    location_breakdown: [
      { country: 'USA', city: 'New York', count: 50 },
      { country: 'UK', city: 'London', count: 30 },
      { country: 'Canada', city: 'Toronto', count: 20 },
    ],
  },
}

describe('AnalyticsDashboard', () => {
  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    })
  })

  afterAll(() => {
    Object.assign(navigator, {
      clipboard: originalClipboard,
    })
  })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe('Loading state', () => {
    it('should render loading state initially', () => {
      mockFetch.mockReturnValue(new Promise(() => {}))
      render(<AnalyticsDashboard qrCodeId="1" />)

      expect(screen.getByText('Loading analytics...')).toBeInTheDocument()
    })
  })

  describe('Error state', () => {
    it('should display error message when API fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: () =>
          Promise.resolve({
            success: false,
            error: 'QR code not found',
          }),
      })

      render(<AnalyticsDashboard qrCodeId="999" />)

      await waitFor(() => {
        expect(screen.getByText('QR code not found')).toBeInTheDocument()
      })
    })

    it('should display error message on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })
  })

  describe('Analytics data display', () => {
    it('should render QR code details', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByText('QR Code Analytics')).toBeInTheDocument()
        expect(screen.getByText('https://example.com')).toBeInTheDocument()
      })
    })

    it('should display total scans count', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument()
        expect(screen.getByText('Total Scans')).toBeInTheDocument()
      })
    })

    it('should render scans over time chart section', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByText('Scans Over Time')).toBeInTheDocument()
        expect(screen.getByTestId('line-chart')).toBeInTheDocument()
      })
    })

    it('should render device breakdown chart section', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByText('Device Breakdown')).toBeInTheDocument()
        expect(screen.getByTestId('pie-chart')).toBeInTheDocument()
      })
    })

    it('should render browser breakdown chart section', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByText('Browser Breakdown')).toBeInTheDocument()
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument()
      })
    })

    it('should render geographic distribution table', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByText('Geographic Distribution')).toBeInTheDocument()
        expect(screen.getByText('USA')).toBeInTheDocument()
        expect(screen.getByText('New York')).toBeInTheDocument()
        expect(screen.getByText('London')).toBeInTheDocument()
      })
    })
  })

  describe('Share link functionality', () => {
    it('should render Share Link button', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /share link/i })).toBeInTheDocument()
      })
    })

    it('should copy link to clipboard when Share Link is clicked', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /share link/i })).toBeInTheDocument()
      })

      const shareButton = screen.getByRole('button', { name: /share link/i })
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(mockWriteText).toHaveBeenCalled()
      })
    })

    it('should show confirmation message after copying', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /share link/i })).toBeInTheDocument()
      })

      const shareButton = screen.getByRole('button', { name: /share link/i })
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(screen.getByText('Link Copied!')).toBeInTheDocument()
      })
    })

    it('should reset button text after timeout', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /share link/i })).toBeInTheDocument()
      })

      const shareButton = screen.getByRole('button', { name: /share link/i })
      fireEvent.click(shareButton)

      await waitFor(() => {
        expect(screen.getByText('Link Copied!')).toBeInTheDocument()
      })

      // Advance timer to reset the button text
      await act(async () => {
        jest.advanceTimersByTime(2000)
      })

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /share link/i })).toBeInTheDocument()
      })
    })
  })

  describe('Navigation', () => {
    it('should have back link to all QR codes', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockAnalyticsData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        const backLink = screen.getByRole('link', { name: /back to all qr codes/i })
        expect(backLink).toHaveAttribute('href', '/analytics')
      })
    })
  })

  describe('Zero scans state', () => {
    it('should display message when no scans exist', async () => {
      const noScansData = {
        ...mockAnalyticsData,
        analytics: {
          total_scans: 0,
          scans_by_date: [],
          device_breakdown: [],
          browser_breakdown: [],
          location_breakdown: [],
        },
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: noScansData,
          }),
      })

      render(<AnalyticsDashboard qrCodeId="1" />)

      await waitFor(() => {
        expect(screen.getByText('0')).toBeInTheDocument()
        expect(screen.getByText(/no scans yet/i)).toBeInTheDocument()
      })
    })
  })
})
