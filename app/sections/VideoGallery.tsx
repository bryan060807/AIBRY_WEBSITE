"use client";

interface VideoGalleryProps {
  videos: { src: string; title: string }[];
}

export default function VideoGallery({ videos }: VideoGalleryProps) {
  return (
    <section className="py-24 bg-black border-t border-gray-800">
      <h2 className="text-3xl font-semibold text-white text-center mb-10">
        Latest Visuals
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6">
        {videos.map((video, index) => (
          <div
            key={index}
            className="aspect-video bg-gray-800 rounded-lg overflow-hidden"
          >
            <iframe
              src={video.src}
              title={video.title}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        ))}
      </div>
    </section>
  );
}
