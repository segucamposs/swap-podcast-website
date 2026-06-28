import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { template: "%s — Admin SWAP", default: "Admin SWAP" },
  robots: { index: false, follow: false },
};

/**
 * Admin layout — no public Navbar/Footer.
 * A simple dark sidebar shell.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh bg-zinc-950 text-white">
      {children}
    </div>
  );
}
