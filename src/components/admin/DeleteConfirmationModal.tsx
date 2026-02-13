'use client'

interface QRCodeInfo {
  short_code: string
  target_url: string
  total_scans: number
}

interface DeleteConfirmationModalProps {
  qrCode: QRCodeInfo
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

export default function DeleteConfirmationModal({
  qrCode,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmationModalProps) {
  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url
    return url.substring(0, maxLength) + '...'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={!isDeleting ? onCancel : undefined}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Delete QR Code?
        </h2>

        <div className="mb-4 space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Short Code:
            </span>
            <p className="font-mono text-gray-900 dark:text-white">
              {qrCode.short_code}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Target:
            </span>
            <p
              className="text-gray-900 dark:text-white"
              title={qrCode.target_url}
            >
              {truncateUrl(qrCode.target_url)}
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-lg bg-yellow-50 p-3 dark:bg-yellow-900/20">
          <p className="text-sm text-yellow-800 dark:text-yellow-300">
            This QR has been scanned {qrCode.total_scans} time
            {qrCode.total_scans !== 1 ? 's' : ''}
          </p>
        </div>

        <p className="mb-6 text-sm font-medium text-red-600 dark:text-red-400">
          This action cannot be undone
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            {isDeleting ? 'Deleting...' : 'Delete QR Code'}
          </button>
        </div>
      </div>
    </div>
  )
}
