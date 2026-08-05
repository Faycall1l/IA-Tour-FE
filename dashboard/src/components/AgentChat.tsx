"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  degraded?: boolean;
}

interface AgentChatResponse {
  reply: string;
  session_id: string | null;
  sources?: unknown[];
  degraded: boolean;
}

const TOKEN_KEY = "athar_access_token";

function AuthGate({
  onAuthed,
}: {
  onAuthed: (token: string) => void;
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
      await api.post("/auth/send-otp", { phone });
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
      const res = await api.post<{ access_token: string }>(
        "/auth/verify-otp",
        { phone, code },
      );
      onAuthed(res.access_token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-zinc-500">
        Sign in to chat with the ATHAR travel assistant (passwordless OTP).
      </p>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+2135XXXXXXXX"
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
      {step === "code" && (
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="6-digit code"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {step === "phone" ? (
        <button
          onClick={requestOtp}
          disabled={busy || phone.length < 10}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy ? "Sending…" : "Send code"}
        </button>
      ) : (
        <button
          onClick={verifyOtp}
          disabled={busy || code.length !== 6}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Verify & chat"}
        </button>
      )}
    </div>
  );
}

export default function AgentChat() {
  const [token, setToken] = useState<string | null>(() =>
    typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || busy || !token) return;
    setInput("");
    setError(null);
    setMessages((m) => [...m, { role: "user", text }]);
    setBusy(true);
    try {
      const res = await api.post<AgentChatResponse>(
        "/agent/chat",
        { message: text, session_id: sessionId },
        token,
      );
      setSessionId(res.session_id);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: res.reply, degraded: res.degraded },
      ]);
    } catch (err) {
      const status = err instanceof Error && "status" in err ? (err as { status: number }).status : 0;
      if (status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setError("Session expired — sign in again.");
      } else if (status === 503) {
        setError("Assistant is unavailable right now. Try again shortly.");
      } else {
        setError(err instanceof Error ? err.message : "Message failed");
      }
    } finally {
      setBusy(false);
    }
  }, [busy, input, sessionId, token]);

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setMessages([]);
    setSessionId(null);
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <header className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
        <div>
          <h2 className="font-semibold text-zinc-900">Travel assistant</h2>
          <p className="text-xs text-zinc-500">
            Ask about wilayas, itineraries, transport, or events
          </p>
        </div>
        {token && (
          <button
            onClick={signOut}
            className="text-xs font-medium text-zinc-400 hover:text-zinc-700"
          >
            Sign out
          </button>
        )}
      </header>

      <div className="px-5 py-4">
        {!token ? (
          <AuthGate onAuthed={(t) => setToken(t)} />
        ) : (
          <>
            <div className="mb-3 flex h-80 flex-col gap-3 overflow-y-auto pr-1">
              {messages.length === 0 && (
                <p className="mx-auto mt-8 max-w-xs text-center text-sm text-zinc-400">
                  Try “What can I do in Oran in 2 days?” or “Trains from Algiers
                  to Tlemcen?”
                </p>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === "user"
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-100 text-zinc-800"
                    }`}
                  >
                    {m.text}
                    {m.degraded && (
                      <span className="mt-1.5 block text-[11px] font-medium uppercase tracking-wide text-amber-600">
                        ⚠ Offline answers (rule-based)
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {busy && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm text-zinc-500">
                    Thinking…
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask anything about Algeria…"
                className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <button
                onClick={send}
                disabled={busy || !input.trim()}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}