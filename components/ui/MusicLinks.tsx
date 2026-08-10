import { FaBandcamp } from "react-icons/fa";


export default function MusicLinks() {
return (
<nav aria-label="music platforms" className="flex flex-col sm:flex-row justify-center gap-4">
<a
href="https://aibry.bandcamp.com"
target="_blank"
rel="noopener noreferrer"
aria-label="Listen on Bandcamp"
className="btn bandcamp"
>
<FaBandcamp className="text-xl" />
Bandcamp
</a>
</nav>
);
}
