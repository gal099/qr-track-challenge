import QRGenerator from '@/components/qr-generator/QRGenerator'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white">
              QR Track
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Generate customizable QR codes with built-in analytics tracking
            </p>
          </div>

          {/* QR Generator */}
          <QRGenerator />

          {/* Features */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="mb-4 text-3xl">🎨</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Customizable
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Choose your own colors to match your brand
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="mb-4 text-3xl">📊</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Track scans, devices, browsers, and locations
              </p>
            </div>

            <div className="mb-4 rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
              <div className="text-3xl">⚡</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Instant
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Generate and download QR codes in seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
