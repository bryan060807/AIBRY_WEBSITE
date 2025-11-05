import ContactForm from '@/components/forms/ContactForm';

export const metadata = {
  title: 'Contact | AIBRY',
  description: 'Get in touch with the AIBRY team. Send us your questions, feedback, or stories.',
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-20">
      <h1 className="mb-6 text-center text-4xl font-bold text-[#629aa9]">
        Contact Us
      </h1>
      <p className="mx-auto mb-12 max-w-2xl text-center text-gray-400">
        We’d love to hear from you. Whether you have feedback, need support, or
        just want to say hello — send us a message and we’ll get back to you as
        soon as we can.
      </p>

      <ContactForm />
    </main>
  );
}
