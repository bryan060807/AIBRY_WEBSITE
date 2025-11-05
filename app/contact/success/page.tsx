export const metadata = {
  title: 'Message Sent | AIBRY',
  description: 'Your message has been sent successfully.',
};

export default function ContactSuccessPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="mb-6 text-3xl font-bold text-[#629aa9]">
        Message Sent Successfully
      </h1>
      <p className="mb-8 text-gray-400">
        Thanks for reaching out! Your message has been received and we’ll get
        back to you soon.
      </p>
      <a
        href="/"
        className="rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86]"
      >
        Back to Home
      </a>
    </main>
  );
}
