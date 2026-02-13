import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

export default function AnalyticsPage({
  params,
}: {
  params: { qrCodeId: string }
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <AnalyticsDashboard qrCodeId={params.qrCodeId} />
        </div>
      </div>
    </main>
  )
}
