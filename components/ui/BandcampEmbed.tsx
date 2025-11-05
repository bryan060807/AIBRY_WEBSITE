'use client';

export default function BandcampEmbed() {
  return (
    <div
      className="flex justify-center my-8"
      aria-label="Embedded Bandcamp album player"
    >
      <iframe
        title="Fault Line Bloom by AIBRY"
        className="rounded-lg shadow-lg w-full max-w-sm aspect-[7/10]"
        src="https://bandcamp.com/EmbeddedPlayer/album=247455740/size=large/bgcol=111111/linkcol=629aa9/transparent=true/"
        loading="lazy"
        allow="autoplay"
        sandbox="allow-scripts allow-same-origin allow-popups"
      >
        <a href="https://aibry.bandcamp.com/album/fault-line-bloom">
          Fault Line Bloom by AIBRY
        </a>
      </iframe>
    </div>
  );
}
