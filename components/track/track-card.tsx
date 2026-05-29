import Link from "next/link";
import type { Track } from "@/types";

export function TrackCard({ track }: { track: Track }) {
  const title = track.title_en;
  const description = track.description_en || "";
  const priceLabel = track.is_free
    ? "Free"
    : `৳${track.price_bdt.toLocaleString("en-BD")}`;

  return (
    <Link
      href="/tracks"
      className="block rounded-lg border bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
      <p className="mt-4 text-xs text-gray-500">
        {track.difficulty} · Tier {track.tier} · {priceLabel}
      </p>
    </Link>
  );
}
