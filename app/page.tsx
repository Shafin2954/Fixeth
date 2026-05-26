import Link from "next/link"

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">Fixeth</h1>
        <p className="text-xl text-gray-600 mb-8">
          Bengali-first adaptive learning platform for tech careers in Bangladesh
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/tracks"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Explore Tracks
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
}
