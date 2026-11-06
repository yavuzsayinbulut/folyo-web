"use client";

import { useEffect, useState } from "react";

export type AvailabilityState =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "available" }
  | { kind: "unavailable"; reason: string };

/** Kullanici adi yazilirken 350 ms bekleyip API'ye sorar. Asil garanti yine sunucudaki unique kisittir. */
export function useAvailability(raw: string): AvailabilityState {
  const username = raw.trim().toLowerCase();
  const [result, setResult] = useState<{ username: string; state: AvailabilityState } | null>(null);

  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/usernames/${encodeURIComponent(username)}/availability`, { signal: controller.signal });
        const body: { available: boolean; reason: string | null } = await res.json();
        setResult({
          username,
          state: body.available ? { kind: "available" } : { kind: "unavailable", reason: body.reason ?? "Kullanılamaz" },
        });
      } catch {
        // iptal edilen ya da basarisiz kontrolde son durum korunur
      }
    }, 350);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [username]);

  if (!username) return { kind: "idle" };
  if (result?.username !== username) return { kind: "checking" };
  return result.state;
}

export function safeNext(next: string | null): string | null {
  // Acik yonlendirmeye karsi yalniz site ici yollar kabul edilir.
  return next && next.startsWith("/") && !next.startsWith("//") ? next : null;
}
