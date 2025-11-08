"use client";

interface LiveReviewProps {
  title: string;
  videoSrc: string;
  description?: string;
}

export default function LiveReview({ title, videoSrc, description }: LiveReviewProps) {
  return (
    <section className="py-16 bg-black border-t border-gray-800 text-center">
      <h2 className="text-3xl font-semibold text-white mb-8">{title}</h2>
      <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg border border-gray-800">
        <iframe
          src={videoSrc}
          title={title}
          className="w-full h-[400px]"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {description && (
        <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">{description}</p>
      )}
    </section>
  );
}
