"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const flowLinks = [
  { href: "/plan", label: "Choose destination" },
  { href: "/stays", label: "Pick a stay" },
  { href: "/itinerary", label: "Customize itinerary" },
  { href: "/explore", label: "Explore" },
];

export default function AppNavbar() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-white/40 bg-white/75 px-4 py-1.5 shadow-lg backdrop-blur-md">
        <Link href="/" className="flex shrink-0 flex-col leading-none">
          <span className="text-lg font-black tracking-tight text-pine">
            GOAA
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-moss">
            go around algeria
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {flowLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-medium transition ${
                  active
                    ? "font-semibold text-rustic-gold"
                    : "text-moss hover:text-rustic-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <Link
          href="/profile"
          className="shrink-0 rounded-full bg-sea-foam px-4 py-1.5 text-xs font-semibold text-pine shadow-sm transition hover:bg-champagne"
        >
          Join
        </Link>
      </nav>
    </header>
  );
}
