"use client";

import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    YT?: {
      Player: new (
        el: HTMLElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: { onReady?: (e: { target: YtPlayer }) => void };
        }
      ) => YtPlayer;
      PlayerState: { PLAYING: number; PAUSED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

type YtPlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
};

let apiLoading: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoading) return apiLoading;

  apiLoading = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
  });
  return apiLoading;
}

export type YouTubePlayerHandle = {
  seekTo: (seconds: number) => void;
  getCurrentTime: () => number;
  play: () => void;
  pause: () => void;
};

type Props = {
  videoId: string;
  onReady?: (handle: YouTubePlayerHandle) => void;
  className?: string;
};

export function YouTubePlayer({ videoId, onReady, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);

  const buildHandle = useCallback((): YouTubePlayerHandle => {
    const p = playerRef.current;
    return {
      seekTo: (s) => p?.seekTo(s, true),
      getCurrentTime: () => p?.getCurrentTime() ?? 0,
      play: () => p?.playVideo(),
      pause: () => p?.pauseVideo()
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    void loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current || !window.YT?.Player) return;

      playerRef.current?.destroy();
      containerRef.current.innerHTML = "";
      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin
        },
        events: {
          onReady: () => {
            if (!cancelled) onReady?.(buildHandle());
          },
          onError: (event) => {
            console.error("YouTube player error", event);
          }
        }
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, onReady, buildHandle]);

  useEffect(() => {
    const onSeek = (e: Event) => {
      const detail = (e as CustomEvent<{ seconds: number }>).detail;
      if (typeof detail?.seconds === "number") {
        playerRef.current?.seekTo(detail.seconds, true);
        playerRef.current?.playVideo();
      }
    };
    window.addEventListener("seekVideo", onSeek);
    return () => window.removeEventListener("seekVideo", onSeek);
  }, []);

  return (
    <div
      className={className}
      style={{ aspectRatio: "16/9", width: "100%", background: "#000" }}
    >
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
