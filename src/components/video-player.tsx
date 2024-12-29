"use client";

import { useState, useRef, useEffect } from "react";
import type { Video } from "../data/videos";
import {
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Rewind,
  FastForward,
  Play,
  Pause,
  ExternalLink,
} from "lucide-react";

const sliderStyles = `
  appearance-none 
  h-1.5
  bg-white/30 
  rounded-full 
  outline-none 
  transition-all
  hover:h-2
  [&::-webkit-slider-thumb]:appearance-none
  [&::-webkit-slider-thumb]:w-3
  [&::-webkit-slider-thumb]:h-3
  [&::-webkit-slider-thumb]:rounded-full
  [&::-webkit-slider-thumb]:bg-white
  [&::-webkit-slider-thumb]:hover:scale-125
  [&::-webkit-slider-thumb]:transition-all
  [&::-moz-range-thumb]:appearance-none
  [&::-moz-range-thumb]:w-3
  [&::-moz-range-thumb]:h-3
  [&::-moz-range-thumb]:rounded-full
  [&::-moz-range-thumb]:bg-white
  [&::-moz-range-thumb]:hover:scale-125
  [&::-moz-range-thumb]:border-0
  [&::-moz-range-thumb]:transition-all
  [&::-moz-range-progress]:bg-white
  [&::-moz-range-track]:bg-white/30
  [&::-moz-range-track]:rounded-full
`;

interface VideoPlayerProps {
  video: Video;
  isPopup?: boolean;
  onOpenPopup?: () => void;
}

export function VideoPlayer({
  video,
  isPopup = false,
  onOpenPopup,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5); // Changed from 1 to 0.5
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      const updateTime = () => setCurrentTime(videoElement.currentTime);

      // Update duration when metadata is loaded
      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
      };

      // Update duration when the duration changes
      const handleDurationChange = () => {
        setDuration(videoElement.duration);
      };

      videoElement.addEventListener("timeupdate", updateTime);
      videoElement.addEventListener("loadedmetadata", handleLoadedMetadata);
      videoElement.addEventListener("durationchange", handleDurationChange);

      // Set initial duration if already available
      if (videoElement.duration) {
        setDuration(videoElement.duration);
      }

      return () => {
        videoElement.removeEventListener("timeupdate", updateTime);
        videoElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
        videoElement.removeEventListener(
          "durationchange",
          handleDurationChange
        );
      };
    }
  }, []);

  // Add useEffect to set initial volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = 0.5;
    }
  }, []);

  const startHideControlsTimer = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    if (isPlaying) {
      timeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
        setIsCursorVisible(false);
      }, 3000);
    }
  };

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      setIsCursorVisible(true);
      startHideControlsTimer();
    };

    const handleFullscreenChange = () => {
      const isFullscreenNow = !!document.fullscreenElement;
      setIsFullscreen(isFullscreenNow);
      setShowControls(true);
      setIsCursorVisible(true);
      if (isFullscreenNow && isPlaying) {
        startHideControlsTimer();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("fullscreenchange", handleFullscreenChange);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      }
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      startHideControlsTimer();
    } else {
      setShowControls(true);
      setIsCursorVisible(true);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const handleDoubleClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    const videoWidth = videoRef.current?.clientWidth || 0;
    const clickX = e.nativeEvent.offsetX;

    if (clickX < videoWidth / 2) {
      skipTime(-5);
    } else {
      skipTime(5);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video bg-black group ${
        !isCursorVisible && isFullscreen ? "cursor-none" : ""
      }`}
      onMouseLeave={() => {
        if (isPlaying && !isFullscreen) {
          setShowControls(false);
        }
      }}
      onMouseEnter={() => {
        setShowControls(true);
        setIsCursorVisible(true);
        startHideControlsTimer();
      }}
    >
      <video
        ref={videoRef}
        src={video.videoSrc}
        className="w-full h-full cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={handleDoubleClick}
        preload="metadata"
      />
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        } ${isPopup || isFullscreen ? "" : "opacity-0 group-hover:opacity-100"}`}
        onClick={togglePlay}
      >
        <button className="text-white p-4 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors">
          {isPlaying ? (
            <Pause className="w-12 h-12" />
          ) : (
            <Play className="w-12 h-12" />
          )}
        </button>
      </div>
      <div
        className={`absolute -bottom-1 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent pb-0 ${
          isPopup || isFullscreen ? "" : "opacity-0 group-hover:opacity-100"
        } transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col space-y-1 p-1 sm:p-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleTimelineChange}
            className={`w-full ${sliderStyles}`}
          />
          <div className="flex flex-row items-center justify-between text-white">
            <div className="flex items-center space-x-1.5">
              <button onClick={togglePlay} className="p-1.5 focus:outline-none">
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => skipTime(-5)}
                  className="p-1.5 focus:outline-none"
                >
                  <Rewind className="w-4 h-4" />
                </button>
                <button
                  onClick={() => skipTime(5)}
                  className="p-1.5 focus:outline-none"
                >
                  <FastForward className="w-4 h-4" />
                </button>
              </div>
              <div className="text-xs">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </div>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setVolume(volume === 0 ? 1 : 0)}
                  className="p-1.5 focus:outline-none"
                >
                  {volume === 0 ? (
                    <VolumeX className="w-6 h-6 sm:w-5 sm:h-5" />
                  ) : (
                    <Volume2 className="w-6 h-6 sm:w-5 sm:h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className={`w-14 sm:w-16 ${sliderStyles}`}
                />
              </div>
              <button
                onClick={toggleFullscreen}
                className="p-1.5 focus:outline-none"
              >
                {isFullscreen ? (
                  <Minimize2 className="w-6 h-6 sm:w-5 sm:h-5" />
                ) : (
                  <Maximize2 className="w-6 h-6 sm:w-5 sm:h-5" />
                )}
              </button>
              {!isPopup && (
                <button
                  onClick={onOpenPopup}
                  className="p-1.5 focus:outline-none"
                  aria-label="Open in popup"
                >
                  <ExternalLink className="w-6 h-6 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
