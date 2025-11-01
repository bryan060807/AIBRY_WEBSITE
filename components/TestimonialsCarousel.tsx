'use client';


import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { motion, AnimatePresence } from 'framer-motion';


interface Testimonial {
id: string;
name: string;
message: string;
}


export default function TestimonialsCarousel() {
const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
const [current, setCurrent] = useState(0);
const [loading, setLoading] = useState(true);


useEffect(() => {
const fetchTestimonials = async () => {
const { data, error } = await supabase
.from('testimonials')
.select('id, name, message')
.eq('approved', true)
.order('created_at', { ascending: false });


if (!error && data) setTestimonials(data);
setLoading(false);
};


fetchTestimonials();
}, [supabase]);


useEffect(() => {
if (testimonials.length > 1) {
const interval = setInterval(() => {
setCurrent((prev) => (prev + 1) % testimonials.length);
}, 6000);
return () => clearInterval(interval);
}
}, [testimonials]);


if (loading) {
return <div className="text-center text-gray-400 py-10">Loading testimonials…</div>;
}


if (testimonials.length === 0) {
return <div className="text-center text-gray-400 py-10">No testimonials available yet.</div>;
}


const testimonial = testimonials[current];


return (
<section className="relative max-w-2xl mx-auto text-center my-12 px-4" aria-label="User testimonials">
<AnimatePresence mode="wait">
<motion.div
key={testimonial.id}
initial={{ opacity: 0, y: 10 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -10 }}
transition={{ duration: 0.5 }}
className="text-gray-300"
>
<p className="text-lg italic text-gray-200 mb-4">“{testimonial.message}”</p>
<p className="text-sm font-semibold text-[var(--color-accent)]">— {testimonial.name}</p>
</motion.div>
</AnimatePresence>


{testimonials.length > 1 && (
<div className="flex justify-center gap-2 mt-6">
{testimonials.map((_, index) => (
<button
key={index}
onClick={() => setCurrent(index)}
className={`h-2 w-2 rounded-full transition-all duration-300 ${index === current ? 'bg-[var(--color-accent)] w-4' : 'bg-gray-600'}`}
aria-label={`View testimonial ${index + 1}`}
/>
))}
</div>
)}
</section>
);
}