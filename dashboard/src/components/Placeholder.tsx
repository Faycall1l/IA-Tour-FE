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
      className={`flex min-h-32 items-center justify-center rounded-2xl border-2 border-dashed border-champagne bg-champagne/20 px-6 text-center text-sm text-moss ${className ?? ""}`}
    >
      {label}
    </div>
  );
}
