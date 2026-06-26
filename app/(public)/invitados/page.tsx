import type { Metadata } from "next";
import Link from "next/link";
import { getGuests, getEpisodeCount } from "@/lib/episodes/feed";
import GuestCard from "@/components/guests/GuestCard";

export const metadata: Metadata = {
  title: "Invitados",
  description:
    "Conocé a todos los invitados de SWAP Podcast — personas que construyen algo y tienen mucho para contar.",
};

export const revalidate = 3600;

export default async function InvitadosPage() {
  const [guests, count] = await Promise.all([getGuests(), getEpisodeCount()]);

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <section className="bg-zinc-950 border-b border-white/5 py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-brand-orange text-sm font-medium uppercase tracking-widest font-mono mb-3">
            Invitados
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Las personas detrás de SWAP
          </h1>
          <p className="text-white/40 text-lg mx-auto max-w-xl">
            {count} conversaciones con personas que tienen algo real para decir.
            Sin guion. Sin poses.
          </p>
        </div>
      </section>

      {/* Guests grid */}
      <section className="py-16 px-4" aria-label="Galería de invitados">
        <div className="max-w-6xl mx-auto">
          {guests.length === 0 ? (
            <p className="text-white/40 text-center py-20">
              Cargando invitados…
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {guests.map((episode) => (
                <GuestCard key={episode.id} episode={episode} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA — potential guests */}
      <section className="bg-zinc-950 border-t border-white/5 py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Querés venir al pod?
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-8">
            Si tenés algo valioso para compartir con jóvenes de 16 a 25 años,
            nos encantaría charlar. Sin currículo perfecto — solo algo real para decir.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center bg-brand-orange text-white font-semibold px-8 py-3.5 rounded-full hover:bg-brand-orange/85 transition-colors duration-200"
          >
            Escribirnos
          </Link>
        </div>
      </section>
    </div>
  );
}
