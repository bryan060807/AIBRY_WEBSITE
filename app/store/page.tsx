import Link from "next/link";

export const metadata = {
  title: "Store | AIBRY",
  description: "Official AIBRY merch and apparel.",
};

export default function StorePage() {
  return (
    <main className="min-h-screen bg-black text-gray-100">
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center md:py-28">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.45em] text-[#83c0cc]">
          Official Merch
        </p>
        <h1 className="mb-6 text-4xl font-black uppercase tracking-tight text-white md:text-6xl">
          AIBRY Store
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-gray-300">
          Apparel and merch now live through the official AIBRY merch storefront.
        </p>

        <a
          href="https://merch.aibry.shop"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 rounded-full bg-[#83c0cc] px-8 py-4 font-semibold text-black transition hover:bg-[#6eb5c0]"
        >
          Open Merch Store
        </a>

        <p className="mt-8 max-w-xl text-sm leading-6 text-gray-500">
          Music purchases and Bandcamp embeds have moved to the Bandcamp page.
        </p>
        <Link
          href="/discography"
          className="mt-4 text-sm font-semibold text-[#83c0cc] transition hover:text-white"
        >
          Visit Bandcamp page
        </Link>
      </section>
    </main>
  );
}
