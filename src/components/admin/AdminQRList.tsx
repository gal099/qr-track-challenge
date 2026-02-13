'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import Toast from './Toast'

interface QRCodeSummary {
  id: number
  short_code: string
  target_url: string
  fg_color: string
  bg_color: string
  created_at: string
  total_scans: number
}

type ToastState = {
  type: 'success' | 'error'
  message: string
} | null

export default function AdminQRList() {
  const [qrCodes, setQRCodes] = useState<QRCodeSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<QRCodeSummary | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState<ToastState>(null)
  const router = useRouter()

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

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' })
      router.push('/admin')
    } catch {
      // Still redirect even if logout fails
      router.push('/admin')
    }
  }

  const handleDeleteClick = (qrCode: QRCodeSummary) => {
    setDeleteTarget(qrCode)
  }

  const handleDeleteCancel = () => {
    setDeleteTarget(null)
  }

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/qr/${deleteTarget.short_code}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete QR code')
      }

      // Remove from local state
      setQRCodes((prev) =>
        prev.filter((qr) => qr.short_code !== deleteTarget.short_code)
      )

      setToast({ type: 'success', message: 'QR code deleted successfully' })
    } catch (err) {
      setToast({
        type: 'error',
        message: err instanceof Error ? err.message : 'Failed to delete QR code',
      })
    } finally {
      setIsDeleting(false)
      setDeleteTarget(null)
    }
  }, [deleteTarget])

  const truncateUrl = (url: string, maxLength: number = 40) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="p-4">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="h-4 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-40 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-12 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-4 w-24 rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-8 w-16 rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ))}
          </div>
        </div>
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

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleLogout}
          className="rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          Logout
        </button>
      </div>

      {qrCodes.length === 0 ? (
        <div className="rounded-lg bg-yellow-50 p-8 text-center dark:bg-yellow-900/20">
          <p className="text-lg text-yellow-800 dark:text-yellow-400">
            No QR codes found.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Short Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Target URL
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Scans
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                {qrCodes.map((qrCode) => (
                  <tr key={qrCode.id}>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                        {qrCode.short_code}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400"
                      title={qrCode.target_url}
                    >
                      {truncateUrl(qrCode.target_url)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {qrCode.total_scans}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {format(new Date(qrCode.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        onClick={() => handleDeleteClick(qrCode)}
                        className="rounded bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {deleteTarget && (
        <DeleteConfirmationModal
          qrCode={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  )
}
