import Link from "next/link";
import Placeholder from "@/components/Placeholder";

export const metadata = {
  title: "Business dashboard — ATHAR",
  description: "Dashboard for agencies, guides, restaurants, hotels and more.",
};

const quickLinks = [
  { href: "/business/agency", label: "Agency profile" },
  { href: "/business/guide", label: "Guide profile" },
  { href: "/business/place", label: "Site / hotel / restaurant profile" },
  { href: "/business/artisan", label: "Artisan profile" },
  { href: "/business/trips", label: "Trip tracking" },
];

export default function BusinessDashboardPage() {
  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-zinc-600">
          Manage your businesses — agencies, guides, restaurants, hotels,
          artisans — in one place.
        </p>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Active offers", value: "—" },
          { label: "Upcoming trips", value: "—" },
          { label: "New bookings", value: "—" },
          { label: "Revenue", value: "—" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              {stat.label}
            </p>
            <p className="mt-1 text-2xl font-bold text-zinc-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Placeholder label="Recent bookings" />
        <Placeholder label="Recent reviews" />
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-zinc-900">
          Manage your profiles
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-zinc-200 bg-white px-5 py-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-emerald-500 hover:text-emerald-700"
            >
              {link.label} →
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
