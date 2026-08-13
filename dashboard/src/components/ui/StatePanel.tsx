"use client";

/**
 * Small shared state panels: loading skeletons, an error panel with a retry
 * button, and an empty-state panel. Used across index/detail pages to keep
 * loading/error/empty markup consistent.
 */

export function LoadingGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-72 animate-pulse rounded-2xl bg-champagne" />
      ))}
    </div>
  );
}

export function LoadingPanel() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-2/3 rounded-2xl bg-champagne" />
      <div className="h-64 rounded-2xl bg-champagne" />
      <div className="h-32 rounded-2xl bg-champagne" />
    </div>
  );
}

export function ErrorPanel({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
      <p className="text-sm text-amber-800">
        {message ?? "Could not load this page — is the API running?"}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-full bg-amber-800 px-4 py-1.5 text-xs font-semibold text-white"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function EmptyPanel({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  return (
    <p className="rounded-2xl border border-dashed border-champagne bg-champagne/20 p-6 text-center text-sm text-moss">
      {title}
      {text && <span className="mt-1 block text-xs">{text}</span>}
    </p>
  );
}
