import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad",
  description:
    "Qué datos personales guarda SWAP Podcast, para qué los usamos y cómo pedir que los veamos, corrijamos o borremos.",
};

const CONTACT_EMAIL = "somos@swapodcast.com";
const LAST_UPDATED = "6 de noviembre de 2026";

type Section = { id: string; title: string; body: React.ReactNode };

const SECTIONS: Section[] = [
  {
    id: "quien",
    title: "Quién es responsable",
    body: (
      <p>
        SWAP Podcast es un proyecto de Segundo Campos y Francisco Bottaro. El
        responsable registrado de las bases de datos es Segundo Campos, inscripto
        en el Registro Nacional de Bases de Datos de la Agencia de Acceso a la
        Información Pública (AAIP) con el legajo RL-2026-99644018-APN-DNPDP#AAIP.
        Cualquier consulta sobre tus datos va a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    ),
  },
  {
    id: "que-datos",
    title: "Qué datos guardamos",
    body: (
      <ul>
        <li>
          <strong>Si nos seguís o nos escribís por Instagram:</strong> tu usuario,
          el nombre que mostrás y los mensajes que nos mandás. Lo usamos para
          mandarte el mensaje de bienvenida, pasarte los links de los episodios y
          responderte. Se gestiona con ManyChat, conectado a Instagram.
        </li>
        <li>
          <strong>Si te suscribís al newsletter:</strong> tu nombre y tu email,
          solo para avisarte cuando sale un episodio nuevo.
        </li>
        <li>
          <strong>Si venís al podcast o trabajamos juntos (invitados, marcas y
          sponsors):</strong> tu nombre, datos de contacto e información
          profesional, para coordinar la grabación o el acuerdo. Si sos invitado,
          tu imagen y tu voz aparecen en el episodio publicado, con tu
          consentimiento.
        </li>
      </ul>
    ),
  },
  {
    id: "que-no",
    title: "Qué no hacemos",
    body: (
      <ul>
        <li>No vendemos ni le pasamos tus datos de contacto a nadie.</li>
        <li>No guardamos datos sensibles (salud, religión, política, etc.).</li>
        <li>
          No te mandamos publicidad de terceros por mail ni por mensaje directo.
        </li>
      </ul>
    ),
  },
  {
    id: "donde",
    title: "Dónde se guardan",
    body: (
      <p>
        Usamos servicios en la nube (Instagram/Meta, ManyChat, Notion y
        Supabase) con servidores fuera de Argentina, principalmente en Estados
        Unidos, así que tus datos pueden alojarse ahí. Solo nosotros dos tenemos acceso, con cuentas
        protegidas por verificación en dos pasos. Los guardamos mientras sigas la
        cuenta, estés suscripto o dure la relación con vos, o hasta que nos
        pidas borrarlos.
      </p>
    ),
  },
  {
    id: "derechos",
    title: "Tus derechos",
    body: (
      <>
        <p>
          Podés pedirnos en cualquier momento ver qué datos tenemos tuyos,
          corregirlos o borrarlos. Escribinos a{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> con tu nombre
          (o tu usuario de Instagram) y qué necesitás. También podés dejar de
          seguir la cuenta, pedir la baja por mensaje directo o desuscribirte del
          newsletter.
        </p>
        <p>
          Te respondemos dentro de los plazos de la Ley 25.326 de Protección de
          los Datos Personales: 10 días corridos si pedís acceso, 5 días hábiles
          si pedís corregir o borrar. No te vamos a pedir copia del DNI salvo que
          haya una duda real sobre quién hace el pedido.
        </p>
        <p className="text-white/35 text-sm">
          La AAIP, en su carácter de Órgano de Control de la Ley N° 25.326,
          tiene la atribución de atender las denuncias y reclamos que interpongan
          quienes resulten afectados en sus derechos por incumplimiento de las
          normas vigentes en materia de protección de datos personales.
        </p>
      </>
    ),
  },
];

export default function PrivacidadPage() {
  return (
    <div className="bg-black min-h-screen">
      <section className="bg-zinc-950 border-b border-white/5 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-orange text-sm font-medium uppercase tracking-widest font-mono mb-3">
            Privacidad
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Tus datos, en claro
          </h1>
          <p className="text-white/40 text-lg max-w-lg">
            Qué guardamos, para qué, y cómo pedirnos que lo veamos, corrijamos o
            borremos.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-12">
        {SECTIONS.map((s) => (
          <section key={s.id} aria-labelledby={`${s.id}-heading`}>
            <h2
              id={`${s.id}-heading`}
              className="text-2xl font-bold text-white mb-4"
            >
              {s.title}
            </h2>
            <div className="flex flex-col gap-4 text-white/55 text-base leading-relaxed max-w-2xl [&_a]:text-brand-orange [&_a:hover]:text-brand-orange/70 [&_strong]:text-white/80 [&_strong]:font-semibold [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-3 [&_ul]:list-disc [&_ul]:pl-5">
              {s.body}
            </div>
          </section>
        ))}

        <p className="text-xs text-white/25 font-mono">
          Última actualización: {LAST_UPDATED}
        </p>
      </div>
    </div>
  );
}
