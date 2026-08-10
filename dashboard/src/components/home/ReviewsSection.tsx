"use client";

import { useEffect, useState } from "react";
import { SAMPLE_REVIEWS } from "@/lib/sample-data";

const PAGE_SIZE = 4;
const FLIP_MS = 30000;

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 text-rustic-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-current" : "fill-champagne"}`}
          viewBox="0 0 20 20"
        >
          <path d="M9.05 2.93c.3-.92 1.6-.92 1.9 0l1.28 3.95a1 1 0 0 0 .95.69h4.15c.97 0 1.37 1.24.59 1.81l-3.36 2.44a1 1 0 0 0-.36 1.12l1.28 3.95c.3.92-.75 1.69-1.54 1.12l-3.36-2.44a1 1 0 0 0-1.18 0l-3.36 2.44c-.79.57-1.84-.2-1.54-1.12l1.28-3.95a1 1 0 0 0-.36-1.12L2.08 9.38c-.78-.57-.38-1.81.59-1.81h4.15a1 1 0 0 0 .95-.69l1.28-3.95z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(SAMPLE_REVIEWS.length / PAGE_SIZE);

  useEffect(() => {
    if (totalPages <= 1) return;
    const t = setInterval(
      () => setPage((p) => (p + 1) % totalPages),
      FLIP_MS,
    );
    return () => clearInterval(t);
  }, [totalPages]);

  const visible = SAMPLE_REVIEWS.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <section id="reviews" className="bg-white py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-widest text-rustic-gold">
            Reviews
          </p>
          <h2 className="mt-1 text-2xl font-bold text-pine">
            What do people think?
          </h2>
        </div>

        <div key={page} className="animate-fade-in-up">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {visible.map((review) => (
              <figure
                key={review.id}
                className="flex flex-col rounded-2xl border border-champagne bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-champagne text-sm font-bold text-pine">
                      {review.username.slice(0, 1)}
                    </div>
                    <span className="text-sm font-semibold text-pine">
                      {review.username}
                    </span>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-moss">
                  “{review.comment}”
                </blockquote>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Reviews page ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === page ? "w-6 bg-rustic-gold" : "w-2 bg-champagne hover:bg-rustic-gold"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
