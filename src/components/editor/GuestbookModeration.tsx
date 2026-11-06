"use client";

import { useEffect, useState } from "react";
import { IconEye, IconEyeOff, IconTrash } from "@tabler/icons-react";
import { api } from "@/lib/client-api";
import type { GuestbookEntry } from "@/lib/types";

export function GuestbookModeration() {
  const [entries, setEntries] = useState<GuestbookEntry[] | null>(null);

  const load = () => api<GuestbookEntry[]>("/api/me/guestbook").then(setEntries);

  useEffect(() => {
    load();
  }, []);

  async function toggle(entry: GuestbookEntry) {
    await api(`/api/me/guestbook/${entry.id}`, { method: "PATCH", body: { status: entry.status === "VISIBLE" ? "HIDDEN" : "VISIBLE" } });
    await load();
  }

  async function remove(entry: GuestbookEntry) {
    await api(`/api/me/guestbook/${entry.id}`, { method: "DELETE" });
    await load();
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-5">
      <h2 className="font-medium mb-4">Ziyaretçi defteri</h2>
      {entries === null ? (
        <p className="text-sm text-ink-3">Yükleniyor…</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-ink-3">Henüz mesaj yok. Sayfanı paylaştıkça burada görünecek.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {entries.map((entry) => (
            <li key={entry.id} className={`flex items-start gap-3 py-2.5 ${entry.status === "HIDDEN" ? "opacity-55" : ""}`}>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {entry.authorName} {entry.status === "HIDDEN" && <span className="font-normal text-ink-3">· gizli</span>}
                </p>
                <p className="text-sm text-ink-2 break-words">{entry.body}</p>
              </div>
              <button onClick={() => toggle(entry)} aria-label={entry.status === "VISIBLE" ? "Gizle" : "Göster"} className="inline-flex size-8 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2">
                {entry.status === "VISIBLE" ? <IconEye size={16} /> : <IconEyeOff size={16} />}
              </button>
              <button onClick={() => remove(entry)} aria-label="Sil" className="inline-flex size-8 items-center justify-center rounded-lg text-ink-2 hover:bg-surface-2 hover:text-danger">
                <IconTrash size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
