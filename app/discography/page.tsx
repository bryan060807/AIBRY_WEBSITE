// app/discography/page.tsx
export const metadata = {
  title: "Bandcamp | AIBRY",
  description: "Buy AIBRY albums and tracks directly on Bandcamp.",
};

export default function DiscographyPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-center text-3xl font-bold">Bandcamp</h1>
      <p className="mb-12 text-center text-gray-300">
        Support the music directly through Bandcamp.
      </p>

      <nav aria-label="Discography sections" className="mb-12 flex justify-center gap-3">
        <a href="#albums-and-eps" className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:border-[#629aa9] hover:text-white">
          Albums / EPs
        </a>
        <a href="#singles" className="rounded-full border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:border-[#629aa9] hover:text-white">
          Singles
        </a>
      </nav>

      <section id="albums-and-eps" className="mb-16 scroll-mt-24">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-white">Albums / EPs</h2>
          <p className="mt-2 text-sm text-gray-400">
            Full releases, collections, and longer-form AIBRY projects.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <iframe
            style={{ border: 0, width: "100%", height: "753px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=1928754575/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/ground-wire-gospel">
              Ground Wire Gospel by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "621px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=3827873035/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/the-architecture-is-failing">
              The Architecture is Failing by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "786px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=2019597418/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/the-anti-liturgy">
              The Anti-Liturgy by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "786px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=1973526450/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/copper-mouth">
              Copper Mouth by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "687px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=3746685166/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/the-rare-friction">
              The Rare Friction by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "654px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=36070807/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/the-recovery-session">
              The Recovery Session by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "588px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=988908405/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/strucural-failure">
              Strucural Failure by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "786px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=2199256911/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/the-violence-of-spring">
              The Violence of Spring by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "687px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=3182961818/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/black-box-psalms">
              Black Box Psalms by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "720px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=1908234656/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/the-echo-integration">
              The Echo Integration by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "786px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=247455740/size=large/bgcol=333333/linkcol=0f91ff/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/fault-line-bloom">
              Fault Line Bloom by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "786px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=815869680/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/epitaphs-from-the-neon-dust">
              Epitaphs From the Neon Dust by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "687px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=1310026364/size=large/bgcol=333333/linkcol=0f91ff/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/boots-on-heart-open">
              Boots On, Heart Open by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "786px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=2736056972/size=large/bgcol=333333/linkcol=e32c14/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/whispers-beneath-the-ash">
              Whispers Beneath the Ash by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "786px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=1635215421/size=large/bgcol=333333/linkcol=2ebd35/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/choir-of-broken-mouths">
              Choir of Broken Mouths by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "786px" }}
            src="https://bandcamp.com/EmbeddedPlayer/album=3106363030/size=large/bgcol=333333/linkcol=2ebd35/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/album/the-cassette-tapes">
              The Cassette Tapes by AIBRY
            </a>
          </iframe>
        </div>
      </section>

      <section id="singles" className="scroll-mt-24">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold text-white">Singles</h2>
          <p className="mt-2 text-sm text-gray-400">
            Standalone tracks, reimagined cuts, and single releases.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=3324657623/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/living-as-a-ransom">
              Living as a Ransom by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=822281398/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/fallen-pines-reinvented">
              Fallen Pines (Reinvented) by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=3464935960/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/back-door-rattle">
              Back Door Rattle by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=1257945899/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/mute-protocol">
              Mute Protocol by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=1953116387/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/the-kid-in-the-machine">
              The Kid in the Machine by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=3091298504/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/came-out-wrong">
              Came Out Wrong by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=4083953654/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/porch-flag-high">
              Porch Flag High by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=3516167292/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/fallen-pines-reimagined">
              Fallen Pines(Reimagined) by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=998306284/size=large/bgcol=000000/linkcol=ffffff/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/forty-years-in-the-fire">
              Forty Years in the Fire by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=2675874009/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/bullet-in-the-halo">
              Bullet in the Halo by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=2535016510/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/fractured-circuits">
              Fractured Circuits by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=3292875180/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/glass-eyes">
              Glass Eyes by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=3893703159/size=large/bgcol=333333/linkcol=0f91ff/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/ghost-in-the-glass">
              Ghost in the Glass by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=1206278272/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/the-scar-that-sings">
              The Scar That Sings by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=4075630752/size=large/bgcol=333333/linkcol=2ebd35/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/i-stayed-i-wish-you-had-too">
              I Stayed, I Wish You Had Too by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=1538905007/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/anticipation-of-the-crash">
              Anticipation of the Crash by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=1512313460/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/for-now-its-okay">
              For Now, It&apos;s Okay by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=2725824809/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/necessary-damage">
              Necessary Damage by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=3163635928/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/vantage-point">
              Vantage Point by AIBRY
            </a>
          </iframe>

          <iframe
            style={{ border: 0, width: "100%", height: "442px" }}
            src="https://bandcamp.com/EmbeddedPlayer/track=1555354635/size=large/bgcol=333333/linkcol=e32c14/tracklist=false/transparent=true/"
            seamless
          >
            <a href="https://aibry.bandcamp.com/track/serpent-in-the-ditch">
              Serpent in the Ditch by AIBRY
            </a>
          </iframe>
        </div>
      </section>
    </main>
  );
}
