import type { Episode } from "./types";

// Placeholder data — swap this module for a Supabase client call
// when the database is wired up. All components consume this via
// getEpisodes() / getEpisodeBySlug() so the UI won't need to change.

const episodes: Episode[] = [
  {
    id: "22",
    slug: "eduardo-martins",
    episodeNumber: 22,
    title: "Se fue a lavar platos a Londres a los 21 y hoy tiene una cadena de gimnasios",
    description:
      "Eduardo Martins se fue de Brasil a los 21 años a trabajar de mozo en Londres, sin plata y sin saber bien el idioma. Hoy es socio de Pratique, una de las cadenas de gimnasios más grandes de Brasil, y la acaba de traer a Argentina.",
    guest: "Eduardo Martins",
    guestBio:
      "Socio de Pratique, cadena de gimnasios con presencia en Brasil y Argentina. Llegó a Londres con 21 años sin plata y sin idioma; construyó un modelo de negocio que le paga a la gente por entrenar.",
    youtubeUrl: null, // TODO: add real video ID
    spotifyUrl: "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",
    publishedAt: "2025-06-01T00:00:00.000Z",
    thumbnailUrl: null,
  },
  {
    id: "20",
    slug: "francis-holway",
    episodeNumber: 20,
    title: "Erré el camino mil veces antes de medir a la élite",
    description:
      "Recursó 4 materias y se recibió de nutricionista a los 33. Hoy es uno de los nutricionistas deportivos con más credenciales del mundo — y te dice que la mayoría de los atletas de élite no comen lo que dicen.",
    guest: "Francis Holway",
    guestBio:
      "Nutricionista deportivo con el nivel más alto de certificación en composición corporal del mundo (ISAK Nivel 4). Trabajó con la NFL, la NBA y el Comité Olímpico Internacional. Casi medio millón de seguidores en Instagram sin vender un curso.",
    youtubeUrl: null,
    spotifyUrl: "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",
    publishedAt: "2025-04-15T00:00:00.000Z",
    thumbnailUrl: null,
  },
  {
    id: "19",
    slug: "mauro-dominguez",
    episodeNumber: 19,
    title: "A los 35 descubrió que tenía TDAH y autismo. Lo que nadie sabe es que creció en una villa.",
    description:
      "Mauro Dominguez es policía, piloto privado, ex podcaster con 500 millones de impresiones — y alguien que tuvo que perderlo todo para encontrarse. En este episodio habla de lo que nunca contó.",
    guest: "Mauro Dominguez",
    guestBio:
      "Policía, piloto privado y ex podcaster con más de 500 millones de impresiones. Diagnosticado con TDAH y autismo a los 35 años. Creció en Villa Ceballos en condiciones de pobreza extrema.",
    youtubeUrl: null,
    spotifyUrl: "https://open.spotify.com/show/1t25iC8KdPXDZ9BUr1KgxY",
    publishedAt: "2025-03-20T00:00:00.000Z",
    thumbnailUrl: null,
  },
];

export function getEpisodes(): Episode[] {
  return episodes.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getEpisodeBySlug(slug: string): Episode | undefined {
  return episodes.find((ep) => ep.slug === slug);
}
