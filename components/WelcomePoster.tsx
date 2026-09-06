"use client";

import {
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const POSTER_IMAGES = [
  "/photo1.jpg",
  "/photo2.jpg",
  "/photo3.jpg",
];

const SLIDE_DURATION = 1500;

export default function WelcomePoster() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* --------------------------------
     Poster entrance animation
  -------------------------------- */
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 30);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* --------------------------------
     Image slider
     Every 1.5 seconds
  -------------------------------- */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const interval = window.setInterval(() => {
      setCurrentImage((current) => {
        return (
          (current + 1) %
          POSTER_IMAGES.length
        );
      });
    }, SLIDE_DURATION);

    return () => {
      window.clearInterval(interval);
    };
  }, [isOpen]);

  /* --------------------------------
     Audio setup
  -------------------------------- */
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.loop = true;
    audio.volume = 0.7;
    audio.muted = false;

    const tryPlayAudio = () => {
      audio
        .play()
        .catch(() => {
          // Browser may block autoplay.
          // User interaction will try again.
        });
    };

    tryPlayAudio();

    const handleInteraction = () => {
      if (!audio.paused && !audio.muted) {
        return;
      }

      tryPlayAudio();
    };

    window.addEventListener(
      "pointerdown",
      handleInteraction,
    );

    window.addEventListener(
      "keydown",
      handleInteraction,
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        handleInteraction,
      );

      window.removeEventListener(
        "keydown",
        handleInteraction,
      );
    };
  }, [isOpen]);

  /* --------------------------------
     Sound ON / OFF
  -------------------------------- */
  const toggleSound = () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (isMuted) {
      audio.muted = false;
      setIsMuted(false);

      audio.play().catch(() => {});
    } else {
      audio.muted = true;
      setIsMuted(true);
    }
  };

  /* --------------------------------
     Close poster
  -------------------------------- */
  const closePoster = () => {
    setIsVisible(false);

    const audio = audioRef.current;

    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.muted = true;
    }

    setIsMuted(true);

    window.setTimeout(() => {
      setIsOpen(false);
    }, 350);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio.mp3"
        preload="auto"
        loop
      />

      <div
        className={[
          "fixed inset-0 z-[200]",
          "flex items-center justify-center",
          "bg-black/75",
          "px-4 py-6",
          "backdrop-blur-[3px]",
          "transition-opacity duration-300",
          isVisible
            ? "opacity-100"
            : "opacity-0",
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label="KULAURA BAZAR announcement"
      >
        <div
          className={[
            "relative",
            "w-full max-w-[430px]",
            "transition-all duration-500 ease-out",
            isVisible
              ? "translate-y-0 scale-100"
              : "translate-y-4 scale-[0.96]",
          ].join(" ")}
        >
          {/* --------------------------------
              Original image size/aspect ratio
          -------------------------------- */}
          <div className="relative w-full overflow-hidden rounded-[22px] bg-black shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
            {POSTER_IMAGES.map(
              (image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={`KULAURA BAZAR poster ${index + 1}`}
                  className={[
                    "block",
                    "h-auto",
                    "w-full",
                    "transition-opacity duration-500 ease-in-out",
                    index === currentImage
                      ? "relative opacity-100"
                      : "absolute inset-0 opacity-0",
                  ].join(" ")}
                />
              ),
            )}

            {/* --------------------------------
                Dark overlay
            -------------------------------- */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

            {/* --------------------------------
                Close button
            -------------------------------- */}
            <button
              type="button"
              onClick={closePoster}
              aria-label="Close poster"
              className={[
                "absolute right-3 top-3 z-30",
                "flex h-10 w-10",
                "items-center justify-center",
                "rounded-full",
                "border border-white/30",
                "bg-black/45",
                "text-white",
                "backdrop-blur-md",
                "transition-all duration-200",
                "hover:bg-black/65",
                "active:scale-90",
              ].join(" ")}
            >
              <X
                size={21}
                strokeWidth={2}
              />
            </button>

            {/* --------------------------------
                Sound ON / OFF button
            -------------------------------- */}
            <button
              type="button"
              onClick={toggleSound}
              aria-label={
                isMuted
                  ? "Turn sound on"
                  : "Turn sound off"
              }
              className={[
                "absolute left-3 top-3 z-30",
                "flex h-10 w-10",
                "items-center justify-center",
                "rounded-full",
                "border border-white/30",
                "bg-black/45",
                "text-white",
                "backdrop-blur-md",
                "transition-all duration-200",
                "hover:bg-black/65",
                "active:scale-90",
              ].join(" ")}
            >
              {isMuted ? (
                <VolumeX
                  size={20}
                  strokeWidth={2}
                />
              ) : (
                <Volume2
                  size={20}
                  strokeWidth={2}
                />
              )}
            </button>

            {/* --------------------------------
                Slider indicators
            -------------------------------- */}
            <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5">
              {POSTER_IMAGES.map(
                (_, index) => (
                  <span
                    key={index}
                    className={[
                      "h-1.5 rounded-full",
                      "transition-all duration-300",
                      index === currentImage
                        ? "w-6 bg-white"
                        : "w-1.5 bg-white/45",
                    ].join(" ")}
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}