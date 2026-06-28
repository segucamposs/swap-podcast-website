import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pago — SWAP Podcast",
};

/**
 * Minimal layout for payment status pages — no Lenis/Navbar overhead.
 * Just a centered container with a link back to the store.
 */
export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4 py-16 text-center">
      {children}
      <Link
        href="/store"
        className="mt-8 rounded-full border border-white/20 px-6 py-2 text-sm text-white/60 transition-colors hover:border-brand-orange hover:text-brand-orange"
      >
        ← Volver a la tienda
      </Link>
    </div>
  );
}
