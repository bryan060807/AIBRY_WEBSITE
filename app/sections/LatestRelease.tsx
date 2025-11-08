"use client";

import Image from "next/image";
import Link from "next/link";

interface PlatformLink {
  name: string;
  href: string;
}

interface LatestReleaseProps {
  imageSrc: string;
  title: string;
  description: string;
  links: PlatformLink[];
}

export default function LatestRelease({
  imageSrc,
  title,
  description,
  links,
}: LatestReleaseProps) {
  return (
    <section className="py-24 bg-black border-t border-gray-800 text-center">
      <h2 className="text-3xl font-semibold text-white mb-10">Latest Release</h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 px-8">
        <Image
          src={imageSrc}
          alt={title}
          width={280}
          height={280}
          className="rounded-xl shadow-lg"
        />
        <div className="max-w-md text-left">
          <h3 className="text-2xl font-semibold mb-3 text-[#83c0cc]">{title}</h3>
          <p className="text-gray-400 mb-6">{description}</p>
          <div className="flex gap-4 flex-wrap">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                className="px-5 py-2 rounded border border-[#83c0cc] hover:bg-[#83c0cc] hover:text-black font-semibold transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
