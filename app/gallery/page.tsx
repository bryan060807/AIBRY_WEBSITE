"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

const imageFilenames = [
  "cathedral1.jpg",
  "cathedral2.jpg",
  "confrontation.jpg",
  "demon.jpg",
  "epitaphs-series1.jpg",
  "epitaphs-series2.jpg",
  "epitaphs-series4.jpg",
  "epitaphs1.jpg",
  "epitaphs2.jpg",
  "fire-portrait.jpg",
  "firey-image1.jpg",
  "forest.jpg",
  "graveyard.jpg",
  "hallway.jpg",
  "mirror.jpg",
  "mirror2.jpg",
  "ruins.jpg",
  "shadow-portrait.jpg",
  "spurs1.jpg",
  "spurs2.jpg",
  "still-here.jpg",
  "sun.jpg",
  "throne.jpg",
  "transform.jpg",
  // Add all image filenames here
];

export default function GalleryPage() {
  const [current, setCurrent] = useState(0);
  const total = imageFilenames.length;

  // --- Navigation Handlers ---
  const nextImage = () => setCurrent((prev) => (prev + 1) % total);
  const prevImage = () => setCurrent((prev) => (prev - 1 + total) % total);

  // --- Auto Slideshow ---
  useEffect(() => {
    const interval = setInterval(nextImage, 5000); // 5 seconds
    return () => clearInterval(interval); // Cleanup
  }, [nextImage]);

  // --- Swipe Handlers ---
  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    trackMouse: true, // Also works with mouse swipe
  });

  const currentImage = imageFilenames[current];
  const altText = currentImage
    .replace(/\.(jpg|jpeg|png|webp|gif)$/i, "")
    .replace(/[-_]/g, " ");

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-center">
      <h1 className="mb-8 text-3xl font-bold">Gallery</h1>

      <div
        {...swipeHandlers}
        className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-md bg-black touch-pan-y"
      >
        <Image
          src={`/images/gallery/${currentImage}`}
          alt={altText}
          fill
          className="object-contain transition duration-500 ease-in-out"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="mt-6 flex justify-center gap-6">
        <button
          onClick={prevImage}
          className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
        >
          ◀ Prev
        </button>
        <button
          onClick={nextImage}
          className="rounded bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
        >
          Next ▶
        </button>
      </div>

      <p className="mt-4 text-sm text-gray-400">
        {current + 1} of {total}
      </p>
    </main>
  );
}
