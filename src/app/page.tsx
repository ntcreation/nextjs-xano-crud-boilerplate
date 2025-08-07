import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Next.js Xano CRUD Boilerplate
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Generic CRUD operations for any Xano database
          </p>
          <Link
            href="/admin"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Open Admin Dashboard
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Features</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Generic CRUD for any table structure</li>
              <li>• In-memory demo data</li>
              <li>• Xano backend integration</li>
              <li>• Auto-generated forms and tables</li>
              <li>• Responsive design</li>
              <li>• TypeScript support</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">Demo Tables</h2>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Users:</strong> id, name, email, created_at</li>
              <li>• <strong>Posts:</strong> id, title, content, author_id, published</li>
              <li>• <strong>Categories:</strong> id, name, description, color</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              Currently running in demo mode with in-memory data
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}