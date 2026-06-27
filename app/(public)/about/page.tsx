import type { Metadata } from "next";
import Link from "next/link";
import { getEpisodeCount } from "@/lib/episodes/feed";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Quiénes somos: la historia detrás de SWAP Podcast, los hosts, y por qué hacemos esto.",
};

export const revalidate = 3600;

const HOSTS = [
  {
    name: "Segundo Campos",
    nickname: "Segu",
    initials: "SC",
    bio: "Estudiante de Ingeniería en Sistemas en ITBA. Co-fundador de SWAP. Convencido de que no hay que elegir entre los múltiples intereses — hay que construir con todos.",
    instagram: "https://instagram.com/segucampos",
  },
  {
    name: "Francisco Bottaro",
    nickname: "Fran",
    initials: "FB",
    bio: "Co-fundador de SWAP. La voz que dice lo que todos piensan pero nadie se anima. Editor, productor, y el que mantiene los pies en la tierra cuando las ideas se van al espacio.",
    instagram: null,
  },
];

export default async function AboutPage() {
  const episodeCount = await getEpisodeCount();

  return (
    <div className="bg-black min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative bg-black py-24 px-4 overflow-hidden"
        aria-label="Introducción"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 30% 50%, rgba(255,117,31,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-brand-orange text-sm font-medium uppercase tracking-widest font-mono mb-6">
            Quiénes somos
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8">
            Somos dos pibes de Buenos Aires con muchas preguntas
            <span className="text-brand-orange"> y las personas para responderlas.</span>
          </h1>
          <p className="text-white/55 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            SWAP nació de algo simple: ¿qué pasa si le preguntamos a las personas
            que admiramos todo lo que siempre quisimos saber? Empezamos el podcast
            porque queríamos aprender — y resultó que no éramos los únicos.
          </p>

          <div className="flex flex-wrap gap-8 mt-12 justify-center">
            <div>
              <p className="text-4xl font-bold text-brand-orange">{episodeCount}</p>
              <p className="text-white/40 text-sm mt-1">episodios</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">2024</p>
              <p className="text-white/40 text-sm mt-1">inicio</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">LATAM</p>
              <p className="text-white/40 text-sm mt-1">alcance</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Qué es SWAP ───────────────────────────────────────────── */}
      <section className="bg-zinc-950 border-y border-white/5 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">¿Qué es SWAP?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-white/60 leading-relaxed text-lg">
                SWAP es un podcast para jóvenes de 16 a 25 años que quieren sacar
                valor en cada aspecto de sus vidas. No nos limitamos a un solo tema.
                Entrevistamos personas que creemos que pueden agregarle algo real a
                la vida de nuestros oyentes.
              </p>
            </div>
            <div>
              <p className="text-white/60 leading-relaxed text-lg">
                No somos expertos que bajan línea desde un pedestal. Somos pares.
                Aprendemos junto a nuestros oyentes — haciendo las preguntas que
                todos queremos hacer pero a veces no nos animamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Hosts ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4" aria-labelledby="hosts-heading">
        <div className="max-w-4xl mx-auto">
          <h2 id="hosts-heading" className="text-3xl font-bold text-white mb-12">
            Los hosts
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {HOSTS.map((host) => (
              <div
                key={host.name}
                className="bg-zinc-900 border border-white/8 rounded-2xl p-8 hover:border-brand-orange/30 transition-colors duration-300"
              >
                {/* Avatar placeholder */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-orange/20 to-brand-orange/5 border border-brand-orange/20 flex items-center justify-center mb-6">
                  <span className="text-2xl font-bold text-brand-orange">
                    {host.initials}
                  </span>
                </div>
                <h3 className="text-white font-bold text-xl mb-0.5">{host.name}</h3>
                <p className="text-brand-orange text-sm font-medium mb-4">
                  Co-host · @{host.nickname.toLowerCase()}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">{host.bio}</p>
                {host.instagram && (
                  <a
                    href={host.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-5 text-xs text-white/30 hover:text-brand-orange transition-colors duration-200"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                    Instagram
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA para potenciales invitados ────────────────────────── */}
      <section
        className="relative bg-zinc-950 border-t border-white/5 py-24 px-4 overflow-hidden"
        aria-labelledby="guest-cta-heading"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 50% 80% at 80% 50%, rgba(255,117,31,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-brand-orange text-sm font-medium uppercase tracking-widest font-mono mb-4">
            Para potenciales invitados
          </p>
          <h2 id="guest-cta-heading" className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
            ¿Tenés algo valioso para compartir?
          </h2>
          <p className="text-white/55 text-lg leading-relaxed mb-4">
            Llegamos a jóvenes de 16 a 25 años de Argentina y toda LATAM que quieren
            construir algo mejor para sus vidas. Si tenés una historia, un aprendizaje
            real o una perspectiva que creés que les puede aportar valor —{" "}
            <strong className="text-white/80">no hace falta un currículum perfecto.</strong>
          </p>
          <p className="text-white/40 text-base leading-relaxed mb-10">
            Nos importa lo que tenés para decir, no cuántos seguidores tenés.
            La conversación es informal, grabamos sin apuros, y vas a quedar
            bien — te lo prometemos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-brand-orange text-white font-semibold px-8 py-3.5 rounded-full hover:bg-brand-orange/85 transition-colors duration-200"
            >
              Proponer un episodio
            </Link>
            <Link
              href="/invitados"
              className="inline-flex items-center justify-center border border-white/20 text-white font-medium px-8 py-3.5 rounded-full hover:border-brand-orange hover:text-brand-orange transition-colors duration-200"
            >
              Ver invitados anteriores
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
