import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "../styles/video-player.css";
import { useEffect, useRef, useState } from "react";

import {
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
} from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
  type DefaultLayoutProps,
} from "@vidstack/react/player/layouts/default";

interface VideoPlayerProps {
  src: string;
  title: string;
}

const customLayoutProps: DefaultLayoutProps = {
  icons: defaultLayoutIcons,
  smallLayoutWhen: (state) => state.width < 576,
  translations: {
    Quality: "Quality",
    Playback: "Playback",
    Settings: "Settings",
  },
};

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="white"
    className="opacity-80 hover:opacity-100 transition-opacity"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

export function VideoPlayer({ src, title }: VideoPlayerProps) {
  const [isPaused, setIsPaused] = useState(true);
  const playerRef = useRef<MediaPlayerInstance>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handlePlayClick = () => {
    if (playerRef.current) {
      if (playerRef.current.paused) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFocused) return;

      e.stopPropagation();
      if (e.key === " ") {
        e.preventDefault();
        handlePlayClick();
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener("keydown", handleKeyDown);
      return () => {
        containerRef.current?.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isFocused]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-black group outline-none"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0} // Changed from -1 to 0 to make it focusable
    >
      <MediaPlayer
        ref={playerRef}
        src={src}
        title={title}
        aspectRatio="16/9"
        playsInline
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        keyTarget="player" // Changed from "document" to "player"
        keyShortcuts={{
          seekBackward: "ArrowLeft",
          seekForward: "ArrowRight",
          togglePaused: " ",
        }}
      >
        <MediaProvider />
        <DefaultVideoLayout {...customLayoutProps} />
      </MediaPlayer>
      {isPaused && (
        <div
          className="absolute inset-0 items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40 cursor-pointer hidden md:flex"
          onClick={handlePlayClick}
        >
          <PlayIcon />
        </div>
      )}
    </div>
  );
}
