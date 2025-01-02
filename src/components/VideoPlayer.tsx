import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "../styles/video-player.css";
import { useRef, useState, useEffect } from "react";

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
  id: string;
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

export function VideoPlayer({ src, title, id }: VideoPlayerProps) {
  const [isPaused, setIsPaused] = useState(true);
  const [isSourceLoaded, setIsSourceLoaded] = useState(false);
  const playerRef = useRef<MediaPlayerInstance>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handlePlayClick = () => {
    if (playerRef.current) {
      if (playerRef.current.paused) {
        playerRef.current.play();
      } else {
        playerRef.current.pause();
      }
    }
  };

  const handleSeek = (direction: "forward" | "backward") => {
    if (playerRef.current) {
      const currentTime = playerRef.current.currentTime;
      const newTime =
        direction === "forward" ? currentTime + 10 : currentTime - 10;
      playerRef.current.currentTime = Math.max(
        0,
        Math.min(newTime, playerRef.current.duration)
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleSeek("forward");
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      handleSeek("backward");
    } else if (e.key === " ") {
      e.preventDefault();
      handlePlayClick();
    }
  };

  return (
    <div
      className="relative overflow-hidden rounded-t-xl bg-zinc-100 dark:bg-black group w-full focus:outline-none"
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
    >
      <MediaPlayer
        ref={playerRef}
        src={src}
        title={title}
        aspectRatio="16/9"
        playsInline
        onPlay={() => setIsPaused(false)}
        onPause={() => setIsPaused(true)}
        keyDisabled={true}
        id={`player-${id}`}
        onCanPlay={() => setIsSourceLoaded(true)}
      >
        <MediaProvider />
        <DefaultVideoLayout {...customLayoutProps} thumbnails="" />
      </MediaPlayer>
      {isPaused && isSourceLoaded && (
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
