import Link from "next/link";
import type { Track } from "@/types";

export function TrackCard({ track }: { track: Track }) {
  return (
    <Link
      href={`/dashboard`}
      className="block rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <h2 className="text-xl font-semibold">{track.title}</h2>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{track.description}</p>
      <p className="mt-4 text-xs text-gray-500">{track.difficulty}</p>
    </Link>
  );
}
