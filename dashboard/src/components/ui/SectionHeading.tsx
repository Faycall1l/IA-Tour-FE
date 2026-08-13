import Link from "next/link";

/**
 * Consistent page header: optional back link, optional eyebrow (small caption
 * above the title), title and subtitle. Used by every index/detail page.
 */
export default function SectionHeading({
  backHref,
  backLabel,
  eyebrow,
  title,
  subtitle,
  center,
}: {
  backHref?: string;
  backLabel?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <header className={`mb-8 ${center ? "text-center" : ""}`}>
      {backHref && (
        <Link
          href={backHref}
          className={`mb-6 inline-block text-sm font-normal text-moss hover:text-rustic-gold hover:underline ${
            center ? "" : ""
          }`}
        >
          ← {backLabel ?? "Home"}
        </Link>
      )}
      {eyebrow && (
        <p className={`text-xs font-semibold uppercase tracking-[0.18em] text-rustic-gold ${center ? "" : "mb-1"}`}>
          {eyebrow}
        </p>
      )}
      <h1 className="text-3xl font-bold tracking-tight text-pine">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-moss">{subtitle}</p>}
    </header>
  );
}
