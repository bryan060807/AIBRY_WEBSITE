// app/store/page.tsx
export const metadata = {
  title: "AIBRY Store",
  description: "Buy music and merch from AIBRY on Bandcamp.",
};

export default function StorePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Music Store</h1>
      <p className="mb-12 text-center text-gray-300">
        Support my music by purchasing albums and tracks directly from Bandcamp.
      </p>

      {/* Note: Grid layout is kept, but the tall embeds may cause uneven rows. */}
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Album: Fault Line Bloom (Tall) */}
        <iframe 
          style={{ border: 0, width: "100%", height: "786px" }} 
          src="https://bandcamp.com/EmbeddedPlayer/album=247455740/size=large/bgcol=333333/linkcol=0f91ff/transparent=true/" 
          seamless
        >
          <a href="https://aibry.bandcamp.com/album/fault-line-bloom">Fault Line Bloom by AIBRY</a>
        </iframe>

        {/* Album: Epitaphs From the Neon Dust (Tall) */}
        <iframe 
          style={{ border: 0, width: "100%", height: "786px" }} 
          src="https://bandcamp.com/EmbeddedPlayer/album=815869680/size=large/bgcol=333333/linkcol=e32c14/transparent=true/" 
          seamless
        >
          <a href="https://aibry.bandcamp.com/album/epitaphs-from-the-neon-dust">Epitaphs From the Neon Dust by AIBRY</a>
        </iframe>

        {/* Album: Boots On, Heart Open (Medium-Tall) */}
        <iframe
          style={{ border: 0, width: "100%", height: "687px" }}
          src="https://bandcamp.com/EmbeddedPlayer/album=1310026364/size=large/bgcol=333333/linkcol=0f91ff/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/album/boots-on-heart-open">
            Boots On, Heart Open by AIBRY
          </a>
        </iframe>

        {/* Single: Forty Years in the Fire (Short) */}
        <iframe
          style={{ border: 0, width: "100%", height: "442px" }}
          src="https://bandcamp.com/EmbeddedPlayer/track=998306284/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/track/forty-years-in-the-fire">
            Forty Years in the Fire by AIBRY
          </a>
        </iframe>
        
        {/* NEW SINGLE: Bullet in the Halo (Short) */}
        <iframe
          style={{ border: 0, width: "100%", height: "442px" }}
          src="https://bandcamp.com/EmbeddedPlayer/track=2675874009/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/track/bullet-in-the-halo">
            Bullet in the Halo by AIBRY
          </a>
        </iframe>

        {/* Album: Whispers Beneath the Ash (Tall) */}
        <iframe
          style={{ border: 0, width: "100%", height: "786px" }}
          src="https://bandcamp.com/EmbeddedPlayer/album=2736056972/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/album/whispers-beneath-the-ash">
            Whispers Beneath the Ash by AIBRY
          </a>
        </iframe>

        {/* Album: Choir of Broken Mouths (Tall) */}
        <iframe
          style={{ border: 0, width: "100%", height: "786px" }}
          src="https://bandcamp.com/EmbeddedPlayer/album=1635215421/size=large/bgcol=333333/linkcol=2ebd35/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/album/choir-of-broken-mouths">
            Choir of Broken Mouths by AIBRY
          </a>
        </iframe>

        {/* Album: The Cassette Tapes (Tall) */}
        <iframe
          style={{ border: 0, width: "100%", height: "786px" }}
          src="https://bandcamp.com/EmbeddedPlayer/album=3106363030/size=large/bgcol=333333/linkcol=2ebd35/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/album/the-cassette-tapes">
            The Cassette Tapes by AIBRY
          </a>
        </iframe>

        {/* Track: I Stayed, I Wish You Had Too (Short) */}
        <iframe
          style={{ border: 0, width: "100%", height: "442px" }}
          src="https://bandcamp.com/EmbeddedPlayer/track=4075630752/size=large/bgcol=333333/linkcol=2ebd35/tracklist=false/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/track/i-stayed-i-wish-you-had-too">
            I Stayed, I Wish You Had Too by AIBRY
          </a>
        </iframe>
      </div>
    </main>
  );
}