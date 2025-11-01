export default function BandcampEmbed() {
return (
<iframe
title="Bandcamp Album Player"
style={{ border: 0, width: "100%", maxWidth: "350px", height: "500px" }}
src="https://bandcamp.com/EmbeddedPlayer/album=247455740/size=large/bgcol=333333/linkcol=0f91ff/transparent=true/"
loading="lazy"
allow="autoplay"
className="rounded-lg shadow-lg"
>
<a href="https://aibry.bandcamp.com/album/fault-line-bloom">
Fault Line Bloom by AIBRY
</a>
</iframe>
);
}