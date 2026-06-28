"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

interface AdminShellProps {
  title: string;
  children: React.ReactNode;
}

const NAV = [
  { href: "/admin",          label: "Dashboard",  icon: "⬛" },
  { href: "/admin/products", label: "Productos",  icon: "📦" },
  { href: "/admin/orders",   label: "Pedidos",    icon: "🧾" },
];

export function AdminShell({ title, children }: AdminShellProps) {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleSignOut() {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col gap-1 border-r border-white/10 px-3 py-6 md:flex">
        <div className="mb-6 px-3">
          <span className="font-heading text-xl font-bold text-brand-orange">SWAP</span>
          <span className="ml-2 text-xs text-white/40">admin</span>
        </div>

        {NAV.map(({ href, label, icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-brand-orange/10 text-brand-orange"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </Link>
          );
        })}

        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/40 transition-colors hover:bg-white/5 hover:text-white"
        >
          <span>🚪</span> Cerrar sesión
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 py-8 sm:px-8">
        <h1 className="font-heading mb-8 text-2xl font-bold">{title}</h1>
        {children}
      </main>
    </div>
  );
}
