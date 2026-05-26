'use client'

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="p-6">
          <h2 className="font-bold text-lg">Fixeth</h2>
        </div>
        <nav className="space-y-2 px-4">
          <a
            href="/dashboard"
            className="block p-3 rounded hover:bg-gray-100 font-medium"
          >
            Overview
          </a>
          <a
            href="/tracks"
            className="block p-3 rounded hover:bg-gray-100"
          >
            My Tracks
          </a>
          <a
            href="/profile"
            className="block p-3 rounded hover:bg-gray-100"
          >
            Profile
          </a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
