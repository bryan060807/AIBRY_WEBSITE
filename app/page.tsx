import Image from "next/image";
import MusicLinks from "@/components/MusicLinks";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import TestimonialForm from "@/components/TestimonialForm";

export const metadata = {
  title: "AIBRY",
  description: "Welcome to my official website — music and merch.",
};

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      {/* Logo Hero */}
      <div className="mb-10 flex justify-center">
        <Image
          src="/images/logo.png"
          alt="AIBRY Logo"
          width={400}
          height={400}
          priority
        />
      </div>

      <p className="mb-6 text-lg text-gray-300">
        Welcome to my website — the official hub for my music and merch.
      </p>

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* Testimonial Submission Form */}
      <TestimonialForm />

      {/* Music Link Buttons */}
      <MusicLinks />

    </main>
  );
}