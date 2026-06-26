export interface Episode {
  id: string;
  slug: string;
  episodeNumber: number;
  title: string;
  description: string;
  guest: string;
  guestBio: string;
  youtubeUrl: string | null;
  spotifyUrl: string | null;
  publishedAt: string; // ISO date string
  thumbnailUrl: string | null;
}
