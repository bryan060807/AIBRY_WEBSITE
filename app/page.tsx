'use client';

import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { MusicLinks, TestimonialsCarousel } from '@/components/ui';
import { TestimonialForm } from '@/components/forms';

const BandcampEmbed = dynamic(() => import('@/components/ui/BandcampEmbed'), {
  ssr: false,
  loading: () => (
    <div className="text-gray-500 text-sm mt-8">Loading Bandcamp player...</div>
  ),
});

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current && ref.current.getBoundingClientRect().top < window.innerHeight) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-20 text-center">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="sr-only">AIBRY Official Site</h1>
        <Image
          src="/images/logo.png"
          alt="AIBRY Logo"
          width={400}
          height={400}
          priority
          className="mx-auto drop-shadow-lg"
        />
        <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto">
          Welcome to the official AIBRY site — your hub for music, merch, and mayhem.
        </p>
      </section>

      {/* Music Links */}
      <section className="mb-16">
        <h2 className="text-3xl font-semibold text-white mb-6">Listen & Follow</h2>
        <MusicLinks />
      </section>

      {/* Featured Album */}
      <section ref={ref} className="my-20 flex justify-center">
        {isVisible && <BandcampEmbed />}
      </section>

      {/* Testimonials Display */}
      <section className="my-20">
        <h2 className="text-3xl font-semibold text-white mb-6">What People Say</h2>
        <TestimonialsCarousel />
      </section>

      {/* Testimonial Submission Form */}
      <section className="my-20">
        <h2 className="text-3xl font-semibold text-white mb-6">Share Your Thoughts</h2>
        <TestimonialForm />
      </section>
    </main>
  );
}
