"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const flowLinks = [
  { href: "/plan", label: "Choose Destination" },
  { href: "/plan/picks", label: "Plan" },
  { href: "/stays", label: "Pick a Stay" },
  { href: "/itinerary", label: "Customize Itinerary" },
  { href: "/explore", label: "Explore" },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <div className="mx-auto max-w-6xl">
        <nav className="flex items-center justify-between gap-4 rounded-full border border-white/40 bg-white/75 px-4 py-1.5 shadow-lg backdrop-blur-md">
          <Link href="/" className="flex shrink-0 flex-col leading-none">
            <span className="text-lg font-black tracking-tight text-pine">
              ATHAR
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-moss">
              agentic travel guide
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

          <div className="flex items-center gap-2">
            <Link
              href="/profile"
              className="hidden shrink-0 rounded-full bg-sea-foam px-4 py-1.5 text-xs font-semibold text-pine shadow-sm transition hover:bg-champagne sm:block"
            >
              Join
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-champagne bg-white text-pine transition hover:bg-sea-foam md:hidden"
            >
              {open ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M2 4h12M2 8h12M2 12h12" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {open && (
          <div className="mt-2 rounded-2xl border border-champagne bg-white/95 p-2 shadow-lg backdrop-blur-md md:hidden">
            {flowLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-sm transition ${
                    active
                      ? "bg-sea-foam/40 font-semibold text-pine"
                      : "text-moss hover:bg-champagne/60 hover:text-pine"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl bg-sea-foam px-4 py-2.5 text-sm font-semibold text-pine transition hover:bg-champagne"
            >
              Join
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
