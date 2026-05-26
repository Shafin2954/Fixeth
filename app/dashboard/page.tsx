import { DashboardLayout } from "@/components/dashboard/dashboard-layout"

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Welcome to Fixeth</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-gray-600 text-sm mb-2">Active Enrollments</p>
            <p className="text-3xl font-bold">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-gray-600 text-sm mb-2">Progress</p>
            <p className="text-3xl font-bold">0%</p>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <p className="text-gray-600 text-sm mb-2">Streak</p>
            <p className="text-3xl font-bold">🔥 0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Get Started</h2>
          <a
            href="/tracks"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Explore Tracks
          </a>
        </div>
      </div>
    </DashboardLayout>
  )
}
