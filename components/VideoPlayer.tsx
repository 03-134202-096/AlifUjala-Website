import React, { useRef, useEffect } from "react";

interface VideoPlayerProps {
  storyId: string;
  title: string;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ storyId, title, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl mx-4 rounded-2xl overflow-hidden shadow-2xl bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-lg font-bold backdrop-blur-sm transition-all hover:scale-110"
          onClick={onClose}
          aria-label="Close video"
        >
          ✕
        </button>

        {/* Title bar */}
        <div
          className="absolute top-0 left-0 right-0 z-[5] bg-gradient-to-b from-black/70 to-transparent px-4 pt-3 pb-8 pointer-events-none"
        >
          <h3
            className="text-white text-lg font-bold text-center drop-shadow-lg"
            style={{
              fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
              direction: "rtl",
              lineHeight: "2",
            }}
          >
            {title}
          </h3>
        </div>

        {/* Video */}
        <video
          ref={videoRef}
          src={`/videos/${storyId}.mp4`}
          controls
          autoPlay
          className="w-full aspect-video"
          style={{ display: "block" }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
