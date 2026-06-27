import {

  getLatestEpisode,
  getEpisodeCount,
} from "@/lib/episodes/feed";
import HeroSection from "@/components/home/HeroSection";
import AllEpisodesButton from "@/components/ui/AllEpisodesButton";
import QuienesSomos from "@/components/home/QuienesSomos";
import PlatformEmbed from "@/components/episodes/PlatformEmbed";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import SocialLinks from "@/components/layout/SocialLinks";

async function getLatestYouTubeVideoId(): Promise<string> {
  try {
    const res = await fetch(
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCXu0Hjf9PLzy-WgoeeMteOQ",
      { next: { revalidate: 3600 } }
    );
    const xml = await res.text();
    // Split into entries and skip Shorts (their link contains /shorts/ not /watch?v=)
    const entries = xml.split("<entry>");
    for (const entry of entries) {
      if (entry.includes('href="https://www.youtube.com/watch?v=')) {
        const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        if (idMatch?.[1]) return idMatch[1];
      }
    }
    return "";
  } catch {
    return "";
  }
}

export const revalidate = 3600;

export default async function HomePage() {
  const [latestEpisode, episodeCount, latestYouTubeVideoId] = await Promise.all([
    getLatestEpisode(),
    getEpisodeCount(),
    getLatestYouTubeVideoId(),
  ]);


  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <HeroSection episodeCount={episodeCount} />

      {/* ── Quiénes somos ─────────────────────────────────────────── */}
      <QuienesSomos />

      {/* ── Latest episode player ──────────────────────────────────── */}
      {latestEpisode && (
        <section className="bg-zinc-950 border-y border-white/5 py-16 px-4" aria-label="Último episodio">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <p className="text-white/30 text-xs font-mono uppercase tracking-widest mb-1">
                Último episodio
              </p>
              <h2 className="text-2xl font-bold text-white">
                Escuchalo donde quieras
              </h2>
            </div>

            <PlatformEmbed latestYouTubeVideoId={latestYouTubeVideoId} />

            <div className="mt-8 flex justify-center">
              <AllEpisodesButton />
            </div>
          </div>
        </section>
      )}


      {/* ── Newsletter ─────────────────────────────────────────────── */}
      <section className="bg-black py-20 px-4" aria-label="Newsletter">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-brand-orange text-xs font-medium uppercase tracking-widest font-mono mb-4">
            Newsletter
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">
            Nuevo episodio, directo a tu mail
          </h2>
          <p className="text-white/40 text-base leading-relaxed mb-8">
            Cuando publicamos un episodio nuevo, te avisamos. Sin spam. Solo SWAP.
          </p>
          <NewsletterForm />
        </div>
      </section>

      {/* ── Seguinos ───────────────────────────────────────────────── */}
      <section className="bg-zinc-950 border-y border-white/5 py-16 px-4" aria-label="Redes sociales">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-xl font-bold text-white mb-2">No te perdás nada</h2>
          <p className="text-white/35 text-sm mb-8">
            Seguinos donde preferís escuchar.
          </p>
          <SocialLinks className="justify-center" size="md" />
        </div>
      </section>

    </>
  );
}
