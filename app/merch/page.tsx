export const metadata = {
  title: "Merch | AIBRY",
  description: "Official AIBRY merchandise — shirts, hoodies, and more.",
};

export default function MerchPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12 text-center">
      <h1 className="mb-10 text-3xl font-bold">Merch</h1>
      <p className="mb-8 text-gray-300">
        Grab official AIBRY merch — powered by Printify. Wear the music.
      </p>

      {/* Embedded Printify Storefront */}
      <div className="relative w-full overflow-hidden rounded-lg shadow-lg">
        <iframe
          src="https://aibry-merch.printify.me/"
          className="h-[90vh] w-full border-0"
          loading="lazy"
        />
      </div>

      {/* Direct Store Link */}
      <div className="mt-8">
        <a
          href="https://aibry-merch.printify.me/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded bg-[#629aa9] px-6 py-3 font-semibold text-white transition hover:bg-[#4f7f86]"
        >
          Open Full Store
        </a>
      </div>
    </main>
  );
}