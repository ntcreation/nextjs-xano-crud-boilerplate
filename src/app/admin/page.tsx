import Link from 'next/link'

const tables = [
  {
    name: 'post',
    description: 'Blog posts and articles',
    count: 1, // Will be dynamically loaded
    fields: ['id', 'title', 'content', 'user_id', 'published', 'created_at']
  },
  {
    name: 'category',
    description: 'Content categories and tags',
    count: 1, // Will be dynamically loaded
    fields: ['id', 'name', 'description', 'color', 'created_at']
  }
]

export default function AdminDashboard() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your database tables and records</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tables.map((table) => (
            <Link
              key={table.name}
              href={`/admin/${table.name}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                  {table.name}
                </h3>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {table.count} records
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{table.description}</p>
              <div className="text-xs text-gray-500">
                <strong>Fields:</strong> {table.fields.join(', ')}
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Xano Mode:</strong> Connected to your Xano database. CRUD operations will modify real data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}