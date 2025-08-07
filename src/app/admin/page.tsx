import Link from 'next/link'

const tables = [
  {
    name: 'users',
    description: 'User accounts and profiles',
    count: 25,
    fields: ['id', 'name', 'email', 'created_at']
  },
  {
    name: 'posts',
    description: 'Blog posts and articles',
    count: 42,
    fields: ['id', 'title', 'content', 'author_id', 'published']
  },
  {
    name: 'categories',
    description: 'Content categories and tags',
    count: 8,
    fields: ['id', 'name', 'description', 'color']
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

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> Currently using in-memory data. To connect to Xano, configure your environment variables and switch to Xano mode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}