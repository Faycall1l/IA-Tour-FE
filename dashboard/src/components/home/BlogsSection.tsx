"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SAMPLE_POSTS } from "@/lib/sample-data";

const PAGE_SIZE = 2;
const FLIP_MS = 12000;

export default function BlogsSection() {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(SAMPLE_POSTS.length / PAGE_SIZE);

  useEffect(() => {
    if (totalPages <= 1) return;
    const t = setInterval(
      () => setPage((p) => (p + 1) % totalPages),
      FLIP_MS,
    );
    return () => clearInterval(t);
  }, [totalPages]);

  const visible = SAMPLE_POSTS.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <section id="blog" className="bg-white py-10">
      <div className="mx-auto mb-5 max-w-7xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-rustic-gold">
          Travel blogs & vlogs
        </p>
        <h2 className="mt-1 text-2xl font-bold text-pine">
          Agencies and guides on the ground
        </h2>
      </div>

      <div key={page} className="mx-auto max-w-7xl animate-fade-in-up px-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {visible.map((post) => (
            <article
              key={post.id}
              className="flex flex-col overflow-hidden rounded-xl border border-champagne bg-white shadow-sm"
            >
              <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-5xl">
                {post.emoji}
                <span
                  className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    post.isVideo
                      ? "bg-sea-foam/70 text-pine"
                      : "bg-champagne text-rustic-gold"
                  }`}
                >
                  {post.isVideo ? "▶ Vlog" : "🖼 Blog"}
                </span>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2 py-0.5 text-[11px] font-medium text-white">
                  {post.isVideo ? "▶ Video slides" : "🖼 Photo slides"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne text-base">
                    {post.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-pine">
                      {post.author}
                    </p>
                    <p className="text-xs text-moss">{post.authorRole}</p>
                  </div>
                </div>
                <h3 className="mt-3 text-base font-bold text-pine">
                  {post.title}
                </h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-moss">
                  {post.text}
                </p>
                <Link
                  href="/explore"
                  className="mt-3 text-sm font-medium text-rustic-gold hover:underline"
                >
                  Read →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            aria-label={`Posts page ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === page
                ? "w-6 bg-rustic-gold"
                : "w-2 bg-champagne hover:bg-rustic-gold"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
