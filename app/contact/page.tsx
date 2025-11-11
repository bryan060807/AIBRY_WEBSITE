import ContactForm from '@/components/forms/ContactForm';

export const metadata = {
  title: 'Contact | AIBRY',
  description: 'Reach out to me directly — I’d love to hear your thoughts, ideas, or stories.',
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-20">
      <h1 className="mb-6 text-center text-4xl font-bold text-[#629aa9]">
        Get in Touch
      </h1>
      <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
        I appreciate when people take the time to reach out. Whether you’ve got feedback,
        ideas, or just want to say hey — drop me a message and I’ll get back to you
        when I can.
      </p>

      <ContactForm />
    </main>
  );
}
