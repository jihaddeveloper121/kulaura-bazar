"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const POSTER_IMAGES = [
  "/photo1.jpg",
  "/photo2.jpg",
  "/photo3.jpg",
];

const SLIDE_DURATION = 1500;

const POSTER_STORAGE_KEY =
  "kulaura-welcome-poster-seen";

export default function WelcomePoster() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  /* --------------------------------
     Show poster only once
  -------------------------------- */
  useEffect(() => {
    const alreadySeen = localStorage.getItem(
      POSTER_STORAGE_KEY
    );

    if (alreadySeen === "true") {
      return;
    }

    setIsOpen(true);

    const timer = window.setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  /* --------------------------------
     Poster slider
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
     Close poster
  -------------------------------- */
  const closePoster = () => {
    setIsVisible(false);

    localStorage.setItem(
      POSTER_STORAGE_KEY,
      "true"
    );

    window.setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`
        fixed
        inset-0
        z-[200]
        flex
        items-center
        justify-center
        bg-black/65
        px-4
        py-6
        backdrop-blur-[2px]
        transition-opacity
        duration-300
        ${
          isVisible
            ? "opacity-100"
            : "opacity-0"
        }
      `}
      role="dialog"
      aria-modal="true"
      aria-label="KULAURA BAZAR promotion"
    >
      {/* POSTER WRAPPER */}
      <div
        className={`
          relative
          w-full
          max-w-[360px]
          overflow-hidden
          rounded-[18px]
          bg-black
          shadow-[0_20px_60px_rgba(0,0,0,0.35)]
          transition-all
          duration-300
          ${
            isVisible
              ? "translate-y-0 scale-100"
              : "translate-y-3 scale-[0.97]"
          }
        `}
      >
        {/* POSTER IMAGE */}
        <div className="relative aspect-[4/5] w-full">

          <Image
            key={POSTER_IMAGES[currentImage]}
            src={POSTER_IMAGES[currentImage]}
            alt={`KULAURA BAZAR promotion ${
              currentImage + 1
            }`}
            fill
            priority={currentImage === 0}
            sizes="(max-width: 480px) calc(100vw - 32px), 360px"
            className="object-cover"
          />

        </div>

        {/* CLOSE BUTTON */}
        <button
          type="button"
          onClick={closePoster}
          aria-label="Close poster"
          className="
            absolute
            right-3
            top-3
            z-20
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-black/45
            text-white
            backdrop-blur-md
            transition
            hover:bg-black/60
            active:scale-90
          "
        >
          <X
            size={19}
            strokeWidth={2}
          />
        </button>

        {/* SLIDER DOTS */}
        <div
          className="
            absolute
            bottom-3
            left-1/2
            z-20
            flex
            -translate-x-1/2
            items-center
            gap-1.5
          "
        >
          {POSTER_IMAGES.map(
            (_, index) => (
              <span
                key={index}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    index === currentImage
                      ? "w-5 bg-white"
                      : "w-1.5 bg-white/50"
                  }
                `}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}