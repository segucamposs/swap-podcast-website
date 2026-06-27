import type { Metadata } from "next";
import { getGuests, getEpisodeCount } from "@/lib/episodes/feed";
import { guestMeta } from "@/lib/episodes/guest-meta";
import GuestTimeline from "@/components/guests/GuestTimeline";

export const metadata: Metadata = {
  title: "Invitados",
  description:
    "La línea de tiempo de SWAP Podcast — del primer invitado al último, con cada cara y cada historia.",
};

export const revalidate = 3600;

export default async function InvitadosPage() {
  const [allGuests, count] = await Promise.all([
    getGuests(),
    getEpisodeCount(),
  ]);

  // Only curated guests (early solo episodes also have a "|" in their title, so
  // we key off the metadata list instead). Oldest → newest — the timeline reads down.
  const guests = allGuests
    .filter((ep) => ep.slug in guestMeta)
    .sort(
      (a, b) =>
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime(),
    );

  return <GuestTimeline guests={guests} count={count} />;
}
