type PlaceholderProps = {
  label: string;
  className?: string;
};

/**
 * Temporary dashed-box placeholder used while pages are being built.
 * Each page's sections will replace these as their elements are defined.
 */
export default function Placeholder({ label, className }: PlaceholderProps) {
  return (
    <div
      className={`flex min-h-32 items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-white/70 px-6 text-center text-sm text-zinc-400 ${className ?? ""}`}
    >
      {label}
    </div>
  );
}
