export const metadata = {
  title: "AIBRY Store",
  description: "Buy music and merch from AIBRY on Bandcamp.",
};

export default function StorePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Store</h1>
      <p className="mb-12 text-center text-gray-300">
        Support my music by purchasing albums and tracks directly from Bandcamp.
      </p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {/* Album: Boots On, Heart Open */}
        <iframe
          style={{ border: 0, width: "100%", height: "470px" }}
          src="https://bandcamp.com/EmbeddedPlayer/album=1310026364/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/album/boots-on-heart-open">
            Boots On, Heart Open by AIBRY
          </a>
        </iframe>

        {/* Single: Forty Years in the Fire */}
        <iframe
          style={{ border: 0, width: "100%", height: "442px" }}
          src="https://bandcamp.com/EmbeddedPlayer/track=998306284/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/track/forty-years-in-the-fire">
            Forty Years in the Fire by AIBRY
          </a>
        </iframe>

        {/* Album: Whispers Beneath the Ash */}
        <iframe
          style={{ border: 0, width: "100%", height: "470px" }}
          src="https://bandcamp.com/EmbeddedPlayer/album=2736056972/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/album/whispers-beneath-the-ash">
            Whispers Beneath the Ash by AIBRY
          </a>
        </iframe>

         {/* Album: Choir of Broken Mouths */}
       <iframe 
         style={{ border: 0, width: "100%", height: "470px" }} 
         src="https://bandcamp.com/EmbeddedPlayer/album=1635215421/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/" 
         seamless
       >
         <a href="https://aibry.bandcamp.com/album/choir-of-broken-mouths">
           Choir of Broken Mouths by AIBRY
         </a>
       </iframe>
          
        {/* Album: The Cassette Tapes */}
        <iframe
          style={{ border: 0, width: "100%", height: "470px" }}
          src="https://bandcamp.com/EmbeddedPlayer/album=3106363030/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/transparent=true/"
          seamless
        >
          <a href="https://aibry.bandcamp.com/album/the-cassette-tapes">
            The Cassette Tapes by AIBRY
          </a>
        </iframe>
      </div>
    </main>
  );
}

