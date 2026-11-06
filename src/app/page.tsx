import { BentoGrid } from "@/components/CardTile";
import { ClaimBox } from "@/components/ClaimBox";
import type { Card } from "@/lib/types";

const DEMO: Card[] = [
  { id: "1", type: "LINK", size: "WIDE", visible: true, config: { url: "https://open.spotify.com/user/demo", title: "Ne dinliyorum" } },
  { id: "2", type: "LINK", size: "SMALL", visible: true, config: { url: "https://github.com/demo" } },
  { id: "3", type: "LINK", size: "SMALL", visible: true, config: { url: "https://instagram.com/demo" } },
  { id: "4", type: "TEXT", size: "WIDE", visible: true, config: { text: "Backend geliştiriciyim. Hafta sonları film fotoğrafı çekiyorum." } },
  { id: "5", type: "LINK", size: "SMALL", visible: true, config: { url: "https://linkedin.com/in/demo" } },
  { id: "6", type: "LINK", size: "SMALL", visible: true, config: { url: "https://vsco.co/demo" } },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-14 sm:py-24 grid lg:grid-cols-[1fr_1.1fr] gap-14 items-center">
      <section>
        <p className="text-sm font-medium text-accent mb-4">folyo</p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.08]">
          Tüm hesapların,
          <br />
          tek bir sayfada.
        </h1>
        <p className="mt-5 text-lg text-ink-2 max-w-md">
          Instagram, GitHub, Spotify, LinkedIn ve daha fazlasını kartlar halinde diz. Linkini bio&apos;na koy, gerisini sayfan anlatsın.
        </p>
        <div className="mt-8">
          <ClaimBox />
        </div>
      </section>
      <section aria-label="Örnek sayfa" className="rounded-3xl border border-line bg-surface-2 p-4 sm:p-5">
        <BentoGrid cards={DEMO} interactive={false} />
      </section>
    </main>
  );
}
