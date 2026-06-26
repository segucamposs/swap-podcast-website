import type { Metadata } from "next";
import { getAllEpisodes, getEpisodeCount } from "@/lib/episodes/feed";
import EpisodeCard from "@/components/episodes/EpisodeCard";

export const metadata: Metadata = {
  title: "Episodios",
  description:
    "Todos los episodios de SWAP Podcast — conversaciones reales con personas que construyen algo.",
};

export const revalidate = 3600;

export default async function EpisodesPage() {
  const [episodes, count] = await Promise.all([
    getAllEpisodes(),
    getEpisodeCount(),
  ]);

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <section className="bg-zinc-950 border-b border-white/5 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-brand-orange text-sm font-medium uppercase tracking-widest font-mono mb-3">
            Archivo
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Todos los episodios
          </h1>
          <p className="text-white/40 text-lg">
            {count} conversaciones. Ninguna igual.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 px-4" aria-label="Lista de episodios">
        <div className="max-w-6xl mx-auto">
          {episodes.length === 0 ? (
            <p className="text-white/40 text-center py-20">
              No hay episodios disponibles por ahora.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {episodes.map((episode) => (
                <EpisodeCard key={episode.id} episode={episode} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
