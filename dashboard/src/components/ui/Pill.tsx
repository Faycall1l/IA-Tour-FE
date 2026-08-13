/**
 * Small rounded chip used for categories, tags and status labels.
 */
export default function Pill({
  children,
  tone = "default",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "default" | "gold" | "green" | "neutral";
  className?: string;
}) {
  const tones: Record<string, string> = {
    default: "bg-champagne/40 text-moss",
    gold: "bg-champagne text-rustic-gold",
    green: "bg-sea-foam/40 text-pine",
    neutral: "bg-zinc-100 text-zinc-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
