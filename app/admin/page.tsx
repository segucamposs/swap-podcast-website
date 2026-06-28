import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/products"
          className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-brand-orange/40"
        >
          <span className="text-3xl">📦</span>
          <h2 className="font-heading text-lg font-semibold">Productos</h2>
          <p className="text-sm text-white/50">Crear, editar y desactivar productos.</p>
        </Link>

        <Link
          href="/admin/orders"
          className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-brand-orange/40"
        >
          <span className="text-3xl">🧾</span>
          <h2 className="font-heading text-lg font-semibold">Pedidos</h2>
          <p className="text-sm text-white/50">Ver el historial de compras.</p>
        </Link>

        <Link
          href="/store"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-brand-orange/40"
        >
          <span className="text-3xl">🛍️</span>
          <h2 className="font-heading text-lg font-semibold">Ver tienda</h2>
          <p className="text-sm text-white/50">Abre la tienda pública en una nueva pestaña.</p>
        </Link>
      </div>
    </AdminShell>
  );
}
