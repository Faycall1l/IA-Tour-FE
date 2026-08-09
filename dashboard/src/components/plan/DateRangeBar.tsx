"use client";

import { useState } from "react";

export default function DateRangeBar() {
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");

  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-center gap-3 rounded-full border border-champagne bg-white px-4 py-2.5 shadow-sm">
      <div className="flex flex-1 items-center justify-end gap-2 sm:justify-center">
        <label
          htmlFor="plan-departure"
          className="hidden text-[10px] font-normal uppercase tracking-widest text-moss sm:block"
        >
          From
        </label>
        <input
          id="plan-departure"
          type="date"
          value={departure}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDeparture(e.target.value)}
          className="rounded-lg border border-champagne bg-white px-2 py-1 text-xs text-pine outline-none focus:border-sea-foam focus:ring-2 focus:ring-sea-foam/40"
        />
      </div>

      <span className="text-xs text-rustic-gold">→</span>

      <div className="flex flex-1 items-center justify-start gap-2 sm:justify-center">
        <label
          htmlFor="plan-return"
          className="hidden text-[10px] font-normal uppercase tracking-widest text-moss sm:block"
        >
          To
        </label>
        <input
          id="plan-return"
          type="date"
          value={returnDate}
          min={departure || new Date().toISOString().slice(0, 10)}
          onChange={(e) => setReturnDate(e.target.value)}
          className="rounded-lg border border-champagne bg-white px-2 py-1 text-xs text-pine outline-none focus:border-sea-foam focus:ring-2 focus:ring-sea-foam/40"
        />
      </div>
    </div>
  );
}
