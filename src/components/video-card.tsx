import { useState } from "react";
import type { Video } from "../data/videos";
import { VideoPlayer } from "./video-player";

export function VideoCard({ video }: { video: Video }) {
  const [showPopup, setShowPopup] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowPopup(false);
    }
  };

  return (
    <div className="group relative bg-zinc-100 dark:bg-black border border-zinc-200 dark:border-white/10 rounded-lg overflow-hidden">
      <VideoPlayer
        video={video}
        onOpenPopup={togglePopup}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
      <div className="p-4">
        <h3 className="font-medium text-lg text-zinc-900 dark:text-white">
          {video.title}
        </h3>
        <p className="text-zinc-600 dark:text-white/60">{video.description}</p>
      </div>
      {showPopup && (
        <div
          className="fixed inset-0 bg-zinc-900/80 dark:bg-black/90 flex items-center justify-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-zinc-100 dark:bg-black p-4 rounded-lg shadow-xl max-w-4xl w-full border border-zinc-200 dark:border-white/10">
            <VideoPlayer
              video={video}
              isPopup={true}
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
            />
            <div className="mt-4 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                {video.title}
              </h3>
              <button
                onClick={togglePopup}
                className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-white transition-colors"
              >
                Затвори
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
