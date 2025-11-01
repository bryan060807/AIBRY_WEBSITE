'use client';


import Image from "next/image";
import dynamic from "next/dynamic";
import MusicLinks from "@/components/MusicLinks";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import TestimonialForm from "@/components/TestimonialForm";
import { useEffect, useRef, useState } from "react";


const LazyBandcamp = dynamic(() => import("@/components/BandcampEmbed"), {
ssr: false,
});


export default function HomePage() {
const [isVisible, setIsVisible] = useState(false);
const ref = useRef<HTMLDivElement | null>(null);


useEffect(() => {
const observer = new IntersectionObserver(
([entry]) => setIsVisible(entry.isIntersecting),
{ threshold: 0.2 }
);
if (ref.current) observer.observe(ref.current);
return () => observer.disconnect();
}, []);


return (
<main className="mx-auto max-w-4xl px-4 py-20 text-center">
<section className="mb-12">
<Image
src="/images/logo.png"
alt="AIBRY Logo"
width={400}
height={400}
priority
className="mx-auto"
/>
<p className="mt-6 text-lg text-gray-300">
Welcome to my official website — your hub for music, merch, and madness.
</p>
</section>


<section aria-label="music links" className="mb-12">
<MusicLinks />
</section>


<section ref={ref} aria-label="featured album" className="my-16 flex justify-center">
{isVisible && <LazyBandcamp />}
</section>


<section aria-label="testimonials" className="my-16">
<TestimonialsCarousel />
</section>


<section aria-label="submit testimonial" className="my-20">
<TestimonialForm />
</section>
</main>
);
}