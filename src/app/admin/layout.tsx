import Link from 'next/link'

const tables = ['users', 'posts', 'categories']

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/admin" className="flex items-center px-4 text-lg font-semibold text-gray-900">
                CRUD Admin
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {tables.map((table) => (
                  <Link
                    key={table}
                    href={`/admin/${table}`}
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 capitalize"
                  >
                    {table}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500">Demo Mode</span>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}