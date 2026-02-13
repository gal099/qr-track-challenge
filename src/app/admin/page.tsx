import { redirect } from 'next/navigation'
import { hasAdminSession } from '@/lib/admin-session'
import AdminLoginForm from '@/components/admin/AdminLoginForm'

export default async function AdminLoginPage() {
  // Redirect to dashboard if already authenticated
  const isAuthenticated = await hasAdminSession()
  if (isAuthenticated) {
    redirect('/admin/dashboard')
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md px-4">
        <div className="rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            QR Track Admin Panel
          </h1>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  )
}
