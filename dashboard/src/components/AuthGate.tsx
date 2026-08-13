"use client";

import { useState } from "react";
import { client, unwrap } from "@/lib/client";

/**
 * Passwordless OTP sign-in (phone → 6-digit code). Calls `onAuthed(token)`
 * once verification succeeds. Shared by AgentChat, /profile and /business.
 */
export default function AuthGate({
  onAuthed,
  prompt,
  submitLabel,
  className,
}: {
  onAuthed: (token: string) => void;
  prompt?: string;
  submitLabel?: string;
  className?: string;
}) {
  const [phone, setPhone] = useState("+213");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = async () => {
    setBusy(true);
    setError(null);
    try {
      await unwrap(await client.POST("/api/v1/auth/send-otp", { body: { phone } }));
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await unwrap(
        await client.POST("/api/v1/auth/verify-otp", {
          body: { phone, code },
        }),
      );
      onAuthed(res.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-champagne bg-white px-3 py-2 text-sm text-pine placeholder-zinc-400 focus:border-rustic-gold focus:outline-none focus:ring-2 focus:ring-champagne";
  const buttonClass =
    "rounded-lg bg-sea-foam px-4 py-2 text-sm font-semibold text-pine transition hover:bg-champagne disabled:opacity-50";

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      <p className="text-sm text-moss">
        {prompt ?? "Sign in with a phone number (passwordless OTP)."}
      </p>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+2135XXXXXXXX"
        className={inputClass}
      />
      {step === "code" && (
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="6-digit code"
          className={inputClass}
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {step === "phone" ? (
        <button
          onClick={requestOtp}
          disabled={busy || phone.length < 10}
          className={buttonClass}
        >
          {busy ? "Sending…" : "Send code"}
        </button>
      ) : (
        <button
          onClick={verifyOtp}
          disabled={busy || code.length !== 6}
          className={buttonClass}
        >
          {busy ? "Signing in…" : submitLabel ?? "Verify & sign in"}
        </button>
      )}
    </div>
  );
}
