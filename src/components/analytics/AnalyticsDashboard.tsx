'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface AnalyticsData {
  qr_code: {
    id: number
    short_code: string
    target_url: string
    created_at: string
  }
  analytics: {
    total_scans: number
    scans_by_date: { date: string; count: number }[]
    device_breakdown: { device_type: string; count: number }[]
    browser_breakdown: { browser: string; count: number }[]
    location_breakdown: { country: string; city: string; count: number }[]
  }
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AnalyticsDashboard({
  qrCodeId,
}: {
  qrCodeId: string
}) {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/analytics/${qrCodeId}`)
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to fetch analytics')
        }

        setData(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [qrCodeId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-300">
          Loading analytics...
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-6 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          {error || 'Failed to load analytics'}
        </div>
      </div>
    )
  }

  const { qr_code, analytics } = data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
        <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          QR Code Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Target URL:{' '}
          <a
            href={qr_code.target_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {qr_code.target_url}
          </a>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Created: {format(new Date(qr_code.created_at), 'PPP')}
        </p>
      </div>

      {/* Total Scans */}
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-8 text-white shadow-lg">
        <div className="text-center">
          <div className="text-6xl font-bold">{analytics.total_scans}</div>
          <div className="mt-2 text-xl">Total Scans</div>
        </div>
      </div>

      {/* Scans Over Time */}
      {analytics.scans_by_date.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Scans Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.scans_by_date}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'MMM dd')}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(date) => format(new Date(date), 'PPP')}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Scans"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Device & Browser Breakdown */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Device Breakdown */}
        {analytics.device_breakdown.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Device Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.device_breakdown}
                  dataKey="count"
                  nameKey="device_type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {analytics.device_breakdown.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Browser Breakdown */}
        {analytics.browser_breakdown.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              Browser Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.browser_breakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="browser" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#10b981" name="Scans" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Location Breakdown */}
      {analytics.location_breakdown.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Geographic Distribution
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    Country
                  </th>
                  <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">
                    City
                  </th>
                  <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">
                    Scans
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.location_breakdown.map((location, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 dark:border-gray-700"
                  >
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {location.country}
                    </td>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {location.city}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900 dark:text-white">
                      {location.count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data Message */}
      {analytics.total_scans === 0 && (
        <div className="rounded-lg bg-yellow-50 p-6 text-center text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
          No scans yet. Share your QR code to start tracking!
        </div>
      )}
    </div>
  )
}
