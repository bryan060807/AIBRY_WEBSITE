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

      {/* Music Link Buttons */}
      <MusicLinks />

      {/* Merch Preview */}
      <section className="mt-20 rounded-lg border border-gray-800 bg-gray-900 p-8 shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-white">Official Merch</h2>
        <p className="mb-6 text-gray-400">
          New shirts, hoodies, and more available now. Rep AIBRY everywhere you go.
        </p>
        <a
          href="/merch"
          className="inline-block rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86]"
        >
          Visit Merch Store
        </a>
      </section>

      {/* Testimonials */}
      <TestimonialsCarousel />

      {/* Testimonial Submission Form */}
      <TestimonialForm />
    </main>
  );
}
