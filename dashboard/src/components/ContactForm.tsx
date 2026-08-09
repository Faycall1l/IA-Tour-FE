"use client";

import { useState, type FormEvent } from "react";
import { SAMPLE_CONTACTS, type ContactSubmission } from "@/lib/sample-data";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim() || !message.trim() || status === "sending") return;

    setStatus("sending");
    const submission: ContactSubmission = {
      id: `contact-${Date.now()}`,
      email: email.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
    };

    // TODO: replace with real API call once the backend endpoint exists.
    SAMPLE_CONTACTS.push(submission);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-sea-foam/50 bg-sea-foam/15 p-4 text-sm text-champagne">
        <p className="font-semibold">Thank you — message received.</p>
        <p className="mt-1">
          We&apos;ll get back to you at {email} as soon as possible.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="w-full rounded-lg border border-champagne/40 bg-white/10 px-3 py-1 text-[10px] text-champagne placeholder-champagne/50 focus:border-sea-foam focus:outline-none focus:ring-2 focus:ring-sea-foam/40"
      />
      <textarea
        required
        rows={2}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your message"
        className="w-full resize-none rounded-lg border border-champagne/40 bg-white/10 px-3 py-1 text-[10px] text-champagne placeholder-champagne/50 focus:border-sea-foam focus:outline-none focus:ring-2 focus:ring-sea-foam/40"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-lg bg-sea-foam px-4 py-1 text-[10px] font-normal text-pine transition hover:bg-champagne disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
