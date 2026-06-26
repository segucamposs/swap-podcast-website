import type { Metadata } from "next";
import NewsletterForm from "@/components/newsletter/NewsletterForm";
import SocialLinks from "@/components/layout/SocialLinks";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Hablemos. Suscribite al newsletter de SWAP o escribinos para proponer un episodio.",
};

export default function ContactPage() {
  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <section className="bg-zinc-950 border-b border-white/5 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-orange text-sm font-medium uppercase tracking-widest font-mono mb-3">
            Contacto
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Hablemos
          </h1>
          <p className="text-white/40 text-lg max-w-lg">
            Para lo que sea — suscribirte, proponer un invitado, o simplemente decirnos algo.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-16">
        {/* Newsletter */}
        <section aria-labelledby="newsletter-heading">
          <div className="bg-zinc-900 border border-white/8 rounded-2xl p-8 sm:p-10">
            <h2 id="newsletter-heading" className="text-2xl font-bold text-white mb-2">
              Nuevo episodio, directo a tu mail
            </h2>
            <p className="text-white/45 text-base leading-relaxed mb-8 max-w-md">
              Cuando publicamos un episodio nuevo, te avisamos. Sin spam, sin novedades
              de marketing. Solo SWAP.
            </p>
            <NewsletterForm />
          </div>
        </section>

        {/* Potential guest */}
        <section aria-labelledby="guest-heading">
          <h2 id="guest-heading" className="text-2xl font-bold text-white mb-4">
            ¿Querés ser invitado?
          </h2>
          <p className="text-white/50 text-base leading-relaxed mb-6 max-w-xl">
            Si tenés algo valioso para compartir con jóvenes de 16 a 25 años y querés
            venir a SWAP, escribinos. No necesitás una historia perfecta — solo algo real.
          </p>
          <a
            href="mailto:podcastswap@gmail.com?subject=Quiero ser invitado en SWAP"
            className="inline-flex items-center gap-2 bg-brand-orange text-white font-semibold px-8 py-3.5 rounded-full hover:bg-brand-orange/85 transition-colors duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            podcastswap@gmail.com
          </a>
        </section>

        {/* Social */}
        <section aria-labelledby="social-heading">
          <h2 id="social-heading" className="text-2xl font-bold text-white mb-4">
            Seguinos
          </h2>
          <SocialLinks size="md" />
        </section>
      </div>
    </div>
  );
}
