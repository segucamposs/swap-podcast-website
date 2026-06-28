import type { Metadata } from "next";
import { Space_Grotesk, Poppins, Geist_Mono } from "next/font/google";
import InitialOverlay from "@/components/providers/InitialOverlay";
import { CartProvider } from "@/components/providers/CartProvider";
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

export const metadata: Metadata = {
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
        <InitialOverlay />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
