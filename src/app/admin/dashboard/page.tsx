import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-session'
import AdminQRList from '@/components/admin/AdminQRList'

export default async function AdminDashboardPage() {
  // Redirect to login if not authenticated
  const isAuthenticated = await hasAdminSession()
  if (!isAuthenticated) {
    redirect('/admin')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              QR Track Admin
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Manage and delete QR codes
            </p>
          </div>

          <AdminQRList />
        </div>
      </div>
    </main>
  )
}
