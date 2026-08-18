"use client";

import { useEffect, useRef, useState } from "react";

type Review = {
  id: string;
  author: string;
  avatar: string;
  date: string;
  title: string;
  text: string;
  rating: number;
  photos: string[];
  hasVideo: boolean;
  wilaya: string;
  experience: string;
};

const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Sarah M.",
    avatar: "https://i.pravatar.cc/150?img=1",
    date: "March 2025",
    title: "Three days in the Hoggar",
    text: "We left Tamanrasset at dawn in a 4x4 convoy. The road stretched into nothing — red sand, black volcanic rock, and an impossible blue sky. By the second day we reached Assekrem. The sunrise from the plateau was the most beautiful thing I have ever seen. Our Tuareg guide made us mint tea and told us stories about the stars. I came for the landscape and left with a completely new perspective on Algeria. The camps were simple but comfortable, and the food was incredible — fresh bread baked in the sand.",
    rating: 5,
    photos: [
      "https://picsum.photos/seed/rev1a/800/500",
      "https://picsum.photos/seed/rev1b/800/500",
      "https://picsum.photos/seed/rev1c/800/500",
    ],
    hasVideo: false,
    wilaya: "Tamanrasset",
    experience: "Hoggar 4x4 expedition",
  },
  {
    id: "r2",
    author: "Youcef K.",
    avatar: "https://i.pravatar.cc/150?img=3",
    date: "January 2025",
    title: "Rediscovering my own city",
    text: "I grew up in Algiers and thought I knew every corner of the Casbah. I was wrong. The guide took us through hidden courtyards I had never seen, explained Ottoman palace architecture, and shared stories my grandparents never told me.",
    rating: 5,
    photos: [
      "https://picsum.photos/seed/rev2a/800/500",
      "https://picsum.photos/seed/rev2b/800/500",
    ],
    hasVideo: true,
    wilaya: "Algiers",
    experience: "Casbah walking tour",
  },
  {
    id: "r3",
    author: "Emma L.",
    avatar: "https://i.pravatar.cc/150?img=5",
    date: "April 2025",
    title: "Hiking Gouraya with a Kabyle guide",
    text: "The hike to Pic des Singes in Gouraya National Park was a highlight of my trip to Béjaïa. Our Kabyle guide knew every rock formation by name. We saw wild Barbary macaques, walked through pine forests, and reached a viewpoint over the Mediterranean that took my breath away.",
    rating: 4,
    photos: ["https://picsum.photos/seed/rev3a/800/500"],
    hasVideo: false,
    wilaya: "Béjaïa",
    experience: "Gouraya mountain day",
  },
  {
    id: "r4",
    author: "Amine B.",
    avatar: "https://i.pravatar.cc/150?img=8",
    date: "February 2025",
    title: "Roman ruins in the steppe",
    text: "Timgad is not just ruins — it is a city frozen in time. Walking through the triumphal arch, the library, and then sitting in a 2000-year-old theatre still used for performances — it was surreal. The full-day trip from Sétif was seamless.",
    rating: 5,
    photos: [
      "https://picsum.photos/seed/rev4a/800/500",
      "https://picsum.photos/seed/rev4b/800/500",
    ],
    hasVideo: true,
    wilaya: "Sétif",
    experience: "Timgad — Rome in Africa",
  },
  {
    id: "r5",
    author: "Laura P.",
    avatar: "https://i.pravatar.cc/150?img=9",
    date: "May 2025",
    title: "The M'zab valley — a world apart",
    text: "Nothing prepares you for the M'zab. The five cities of the pentapolis sit in a rocky valley surrounded by palm groves. We visited Beni Isguen, walked the narrow streets, saw the grand mosque, and ended the day watching the sunset from the palm grove.",
    rating: 5,
    photos: [
      "https://picsum.photos/seed/rev5a/800/500",
      "https://picsum.photos/seed/rev5b/800/500",
      "https://picsum.photos/seed/rev5c/800/500",
    ],
    hasVideo: false,
    wilaya: "Ghardaïa",
    experience: "M'zab valley overview",
  },
  {
    id: "r6",
    author: "Karim D.",
    avatar: "https://i.pravatar.cc/150?img=11",
    date: "June 2025",
    title: "Sunset over the Bay of Oran",
    text: "Climbed the Santa Cruz fort as the sun dropped over the Bay of Oran. The local storyteller brought the history alive. A short but magical experience that I would recommend to anyone visiting Oran.",
    rating: 4,
    photos: ["https://picsum.photos/seed/rev6a/800/500"],
    hasVideo: false,
    wilaya: "Oran",
    experience: "Santa Cruz at sunset",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 text-[11px] text-rustic-gold">
      {rating >= 1 ? <span className="opacity-100">*</span> : <span className="opacity-30">*</span>}
      {rating >= 2 ? <span className="opacity-100">*</span> : <span className="opacity-30">*</span>}
      {rating >= 3 ? <span className="opacity-100">*</span> : <span className="opacity-30">*</span>}
      {rating >= 4 ? <span className="opacity-100">*</span> : <span className="opacity-30">*</span>}
      {rating >= 5 ? <span className="opacity-100">*</span> : <span className="opacity-30">*</span>}
    </span>
  );
}

export default function ReviewsSection() {
  const [open, setOpen] = useState<Review | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open && open.photos.length > 1) {
      intervalRef.current = setInterval(() => {
        setGalleryIdx((i) => (i + 1) % open.photos.length);
      }, 3500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <section id="reviews" className="py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-rustic-gold">
              Reviews
            </p>
            <h2 className="mt-0.5 text-xl font-bold text-pine">
              What travelers are saying
            </h2>
          </div>

          <div className="no-scrollbar -mx-6 flex gap-3 overflow-x-auto px-6 pb-2">
            {REVIEWS.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setOpen(r);
                  setGalleryIdx(0);
                }}
                className="w-56 shrink-0 overflow-hidden rounded-xl border border-champagne bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center gap-2 px-3 pt-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.avatar}
                    alt={r.author}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold text-pine">
                      {r.author}
                    </p>
                    <Stars rating={r.rating} />
                  </div>
                  {r.photos.length > 0 && (
                    <span className="text-[10px] text-moss">
                      {r.photos.length} photo{r.photos.length !== 1 ? "s" : ""}
                    </span>
                  )}
                  {r.hasVideo && (
                    <span className="text-[10px] text-moss">video</span>
                  )}
                </div>
                <div className="px-3 pb-3 pt-2">
                  <p className="text-[10px] font-semibold text-rustic-gold">
                    {r.experience}
                  </p>
                  <p className="mt-1 line-clamp-3 text-[11px] leading-relaxed text-moss">
                    {r.text}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <div
            className="flex max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-champagne bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gallery side */}
            <div className="relative hidden w-1/2 md:block">
              {open.photos.length > 0 && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={open.photos[galleryIdx]}
                    alt={open.title}
                    className="h-full w-full object-cover"
                  />
                  {open.photos.length > 1 && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={open.photos[(galleryIdx + 1) % open.photos.length]}
                        alt=""
                        className="absolute bottom-4 right-4 h-20 w-28 rounded-xl border-2 border-white object-cover shadow-lg"
                      />
                      <div className="absolute bottom-4 left-4 flex gap-1">
                        {open.photos.map((_, i) => (
                          <span
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${
                              i === galleryIdx
                                ? "w-4 bg-white"
                                : "w-1.5 bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Review side */}
            <div className="flex w-full flex-col p-6 md:w-1/2">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={open.avatar}
                  alt={open.author}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-pine">{open.author}</p>
                  <p className="text-[11px] text-moss">
                    {open.wilaya} · {open.date}
                  </p>
                </div>
              </div>

              <Stars rating={open.rating} />

              <h3 className="mt-3 text-lg font-bold text-pine">{open.title}</h3>

              <div className="mt-2 flex-1 overflow-y-auto">
                <p className="text-sm leading-relaxed text-moss">{open.text}</p>
              </div>

              <p className="mt-3 text-[10px] text-moss/60">
                {open.experience} · {open.photos.length} photo{open.photos.length !== 1 ? "s" : ""}
                {open.hasVideo ? " · video" : ""}
              </p>

              <button
                onClick={() => setOpen(null)}
                className="mt-4 rounded-full bg-champagne px-4 py-1.5 text-xs font-semibold text-pine transition hover:bg-rustic-gold hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
