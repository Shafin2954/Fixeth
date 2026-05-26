import { getAllTracks } from "@/lib/supabase/queries/tracks"
import { TrackCard } from "@/components/track/track-card"

export default async function TracksPage() {
  const tracks = await getAllTracks()

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-2">Career Tracks</h1>
        <p className="text-gray-600">Choose your learning path</p>
      </div>

      {tracks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No tracks available yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tracks.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </main>
  )
}
