"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IconArrowUpRight, IconLogout } from "@tabler/icons-react";
import { api, fetchMe } from "@/lib/client-api";
import type { Card, Me, Profile } from "@/lib/types";
import { Avatar } from "../Avatar";
import { BentoGrid } from "../CardTile";
import { CardManager } from "./CardManager";
import { ClaimForm } from "./ClaimForm";
import { GuestbookModeration } from "./GuestbookModeration";
import { ProfileForm } from "./ProfileForm";
import { StatsPanel } from "./StatsPanel";

export function Editor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetchMe().then((result) => {
      if (!result) {
        const query = searchParams.toString();
        router.replace(`/login?next=${encodeURIComponent(`/edit${query ? `?${query}` : ""}`)}`);
        return;
      }
      setMe(result);
    });
  }, [router, searchParams]);

  if (!me) return <p className="p-8 text-ink-3">Yükleniyor…</p>;

  if (!me.profile) {
    return (
      <ClaimForm
        me={me}
        initialUsername={searchParams.get("username") ?? ""}
        onClaimed={(profile) => setMe({ ...me, profile })}
      />
    );
  }

  const connected = searchParams.get("connected");
  const connectError = searchParams.get("connectError");
  const notice = connected
    ? { ok: true, text: `${connected === "spotify" ? "Spotify" : "Strava"} hesabın bağlandı. Şimdi kartını ekleyebilirsin.` }
    : connectError
      ? { ok: false, text: "Hesap bağlanmadı: izin verilmedi." }
      : null;

  return <Workspace me={me} profile={me.profile} notice={notice} onProfileChange={(profile) => setMe({ ...me, profile })} />;
}

function Workspace({
  me,
  profile,
  notice,
  onProfileChange,
}: {
  me: Me;
  profile: Profile;
  notice: { ok: boolean; text: string } | null;
  onProfileChange: (p: Profile) => void;
}) {
  const router = useRouter();
  const [cards, setCards] = useState<Card[] | null>(null);
  const [tab, setTab] = useState<"edit" | "stats">("edit");

  useEffect(() => {
    api<Card[]>("/api/me/cards").then(setCards);
  }, []);

  async function logout() {
    await api("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  return (
    <div className="flex-1">
      <header className="sticky top-0 z-10 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 h-14">
          <Link href="/" className="font-semibold text-accent">folyo</Link>
          <span className="text-ink-3">/</span>
          <span className="text-sm text-ink-2 truncate">{profile.username}</span>
          <nav aria-label="Editör bölümleri" className="ml-4 flex gap-1">
            {(
              [
                ["edit", "Düzenle"],
                ["stats", "İstatistik"],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setTab(value)}
                aria-current={tab === value ? "page" : undefined}
                className={`h-8 rounded-lg px-3 text-sm ${tab === value ? "bg-surface-2 text-ink font-medium" : "text-ink-2 hover:text-ink"}`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href={`/${profile.username}`} target="_blank" className="inline-flex h-9 items-center gap-1 rounded-xl border border-line-strong px-3 text-sm hover:bg-surface-2">
              Sayfanı gör <IconArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <button onClick={logout} aria-label="Çıkış yap" className="inline-flex size-9 items-center justify-center rounded-xl text-ink-2 hover:bg-surface-2">
              <IconLogout size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {tab === "stats" ? (
        <div className="mx-auto max-w-4xl px-4 py-8">
          <StatsPanel username={profile.username} />
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
          <div className="flex flex-col gap-6 min-w-0">
            {notice && (
              <p role="status" className={`rounded-xl px-4 py-3 text-sm ${notice.ok ? "bg-ok-soft text-ok-ink" : "bg-surface-2 text-danger"}`}>
                {notice.text}
              </p>
            )}
            <ProfileForm profile={profile} onSaved={onProfileChange} />
            {cards ? <CardManager cards={cards} onChange={setCards} /> : <p className="text-ink-3">Kartlar yükleniyor…</p>}
            <GuestbookModeration />
          </div>

          <aside aria-label="Önizleme" className="lg:sticky lg:top-20 self-start min-w-0">
            <p className="mb-2 text-sm text-ink-3">Ziyaretçi böyle görüyor</p>
            <div className="rounded-3xl border border-line bg-surface-2 p-5">
              <div className="mb-5 flex items-center gap-4">
                <Avatar name={profile.displayName} url={me.user.avatarUrl} size={56} />
                <div className="min-w-0">
                  <p className="font-semibold text-lg truncate">{profile.displayName}</p>
                  {profile.bio && <p className="text-sm text-ink-2 line-clamp-2">{profile.bio}</p>}
                </div>
                {profile.status && (
                  <span className="ml-auto shrink-0 rounded-full bg-ok-soft px-2.5 py-1 text-xs text-ok-ink">{profile.status}</span>
                )}
              </div>
              {cards && cards.some((c) => c.visible) ? (
                <BentoGrid cards={cards.filter((c) => c.visible)} interactive={false} />
              ) : (
                <p className="rounded-2xl border border-dashed border-line-strong p-8 text-center text-sm text-ink-3">
                  Kart ekledikçe burada görünecek.
                </p>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
