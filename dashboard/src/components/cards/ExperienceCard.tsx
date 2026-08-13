import Link from "next/link";
import type { ExperienceRead } from "@/lib/types";

const CATEGORY_EMOJIS: Record<string, string> = {
  tour: "🧭",
  tours: "🧭",
  cultural: "🎭",
  adventure: "🧗",
  hiking: "🥾",
  trekking: "🥾",
  wellness: "🧘",
  food: "🍲",
  nature: "🌿",
  desert: "🏜️",
};

export function categoryEmoji(category: string): string {
  return CATEGORY_EMOJIS[category.toLowerCase()] ?? "🏜️";
}

export function formatDzd(amount: number | null): string {
  if (amount == null) return "Free";
  return `${amount.toLocaleString("en-US")} DZD`;
}

export default function ExperienceCard({
  experience,
}: {
  experience: ExperienceRead;
}) {
  const exp = experience;
  const emoji = categoryEmoji(exp.category);
  const photo = exp.photos?.[0];

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-champagne bg-white shadow-sm transition hover:shadow-md">
      <div className="relative flex h-40 items-center justify-center bg-gradient-to-br from-champagne to-sea-foam/60 text-5xl">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={exp.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          emoji
        )}
        <span className="absolute right-3 top-3 rounded-full bg-champagne px-2 py-0.5 text-[11px] font-semibold capitalize text-rustic-gold">
          {exp.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-champagne text-base">
            {emoji}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-pine">
              {exp.meeting_point ?? "Local agency"}
            </p>
            <p className="text-xs text-moss">
              {exp.duration_hours
                ? `${exp.duration_hours}h · ${exp.language ?? "FR/EN"}`
                : exp.language ?? "FR/EN"}
            </p>
          </div>
        </div>
        <h3 className="mt-3 text-base font-bold text-pine">{exp.title}</h3>
        <p className="mt-1 flex-1 text-sm leading-relaxed text-moss">
          {exp.description}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <Link
            href={`/offers/${exp.id}`}
            className="text-sm font-medium text-rustic-gold hover:underline"
          >
            Details →
          </Link>
          <span className="text-sm font-semibold text-emerald-700">
            {formatDzd(exp.price_dzd)}
          </span>
        </div>
      </div>
    </article>
  );
}
