import Link from "next/link";

export interface BreadcrumbSegment {
  label: string;
  href?: string;
}

export default function Breadcrumb({
  segments,
}: {
  segments: BreadcrumbSegment[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-moss">
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return (
            <li key={i} className="flex items-center">
              {i > 0 && (
                <span className="mx-1.5 text-moss/40" aria-hidden="true">
                  /
                </span>
              )}
              {seg.href && !isLast ? (
                <Link
                  href={seg.href}
                  className="text-moss transition hover:text-rustic-gold hover:underline"
                >
                  {seg.label}
                </Link>
              ) : (
                <span className="font-medium text-pine">{seg.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
