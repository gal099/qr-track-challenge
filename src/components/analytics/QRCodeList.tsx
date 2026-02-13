'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'

interface QRCodeSummary {
  id: number
  short_code: string
  target_url: string
  fg_color: string
  bg_color: string
  created_at: string
  total_scans: number
}

export default function QRCodeList() {
  const [qrCodes, setQRCodes] = useState<QRCodeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchQRCodes() {
      try {
        const response = await fetch('/api/qr/list')
        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to fetch QR codes')
        }

        setQRCodes(result.data.qr_codes)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchQRCodes()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="h-6 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
            <div className="mb-4 h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
              <div>
                <div className="h-8 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mt-1 h-3 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
              <div className="text-right">
                <div className="h-3 w-12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mt-1 h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-red-700 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    )
  }

  if (qrCodes.length === 0) {
    return (
      <div className="rounded-lg bg-yellow-50 p-8 text-center dark:bg-yellow-900/20">
        <p className="text-lg text-yellow-800 dark:text-yellow-400">
          No QR codes found.
        </p>
        <p className="mt-2 text-yellow-700 dark:text-yellow-500">
          <Link href="/" className="underline hover:no-underline">
            Generate your first QR code
          </Link>{' '}
          to see analytics here.
        </p>
      </div>
    )
  }

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {qrCodes.map((qrCode) => (
        <Link
          key={qrCode.id}
          href={`/analytics/${qrCode.id}`}
          className="group block rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg dark:bg-gray-800"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {qrCode.short_code}
            </span>
            <div
              className="h-6 w-6 rounded border border-gray-300 dark:border-gray-600"
              style={{
                background: `linear-gradient(135deg, ${qrCode.fg_color} 50%, ${qrCode.bg_color} 50%)`,
              }}
              title={`Colors: ${qrCode.fg_color} / ${qrCode.bg_color}`}
            />
          </div>

          <p
            className="mb-4 text-sm text-gray-600 dark:text-gray-400"
            title={qrCode.target_url}
          >
            {truncateUrl(qrCode.target_url)}
          </p>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {qrCode.total_scans}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                total scans
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Created
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300">
                {format(new Date(qrCode.created_at), 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-sm text-blue-600 group-hover:underline dark:text-blue-400">
              View Analytics →
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}
