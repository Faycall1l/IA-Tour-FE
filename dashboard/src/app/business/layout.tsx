import Link from "next/link";
import { APP_NAME } from "@/lib/config";

const businessNav = [
  { href: "/business", label: "Dashboard" },
  { href: "/business/agency", label: "Agency profile" },
  { href: "/business/guide", label: "Guide profile" },
  { href: "/business/place", label: "Site / hotel / restaurant profile" },
  { href: "/business/artisan", label: "Artisan profile" },
  { href: "/business/trips", label: "Trip tracking" },
];

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-zinc-900"
          >
            {APP_NAME}
          </Link>
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Business dashboard
            </span>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 transition hover:text-emerald-700"
            >
              View site →
            </Link>
          </div>
        </nav>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 pb-8 pt-24 md:flex-row">
        <aside className="md:w-60 md:shrink-0">
          <nav className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
            {businessNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-white hover:text-emerald-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
