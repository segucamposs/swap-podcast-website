import type { Metadata } from "next";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Quiénes somos: la historia detrás de SWAP Podcast, los hosts, y por qué hacemos esto.",
};

export const revalidate = 3600;

export default function AboutPage() {
  return <AboutContent />;
}
