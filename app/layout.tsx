import type { Metadata } from "next";
import { Space_Grotesk, Poppins, Geist_Mono } from "next/font/google";
import InitialOverlay from "@/components/providers/InitialOverlay";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://www.swapodcast.com";

// Tells Google the site's name, so search results show "SWAP Podcast" instead of the bare domain.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SWAP Podcast",
  alternateName: ["SWAP", "swapodcast"],
  url: `${SITE_URL}/`,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "SWAP Podcast",
  title: {
    default: "SWAP Podcast",
    template: "%s | SWAP Podcast",
  },
  description:
    "Conversaciones reales para pibes que construyen algo. El podcast para los que tienen más de una pasión.",
  openGraph: {
    title: "SWAP Podcast",
    description:
      "Conversaciones reales para pibes que construyen algo.",
    siteName: "SWAP Podcast",
    type: "website",
    locale: "es_AR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${spaceGrotesk.variable} ${poppins.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <InitialOverlay />
        {children}
      </body>
    </html>
  );
}
