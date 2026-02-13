import Link from 'next/link'
import QRCodeList from '@/components/analytics/QRCodeList'

export default function AnalyticsDashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                View scan analytics for all your QR codes
              </p>
            </div>
            <Link
              href="/"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
            >
              Generate New QR
            </Link>
          </div>

          {/* QR Code List */}
          <QRCodeList />
        </div>
      </div>
    </main>
  )
}
