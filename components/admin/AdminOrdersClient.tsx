"use client";

import { useEffect, useState, useCallback } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import type { Order } from "@/lib/store/types";

function formatARS(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

const STATUS_LABELS: Record<string, { label: string; class: string }> = {
  pending:   { label: "Pendiente",  class: "bg-yellow-500/10 text-yellow-400" },
  paid:      { label: "Pagado",     class: "bg-green-500/10  text-green-400"  },
  failed:    { label: "Fallido",    class: "bg-red-500/10    text-red-400"    },
  cancelled: { label: "Cancelado",  class: "bg-white/10      text-white/40"   },
};

export function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true); // start true — avoid sync setState in effect

  const fetchOrders = useCallback(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/orders");
        if (active && res.ok) setOrders(await res.json() as Order[]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => fetchOrders(), [fetchOrders]);

  return (
    <AdminShell title="Pedidos">
      {loading ? (
        <p className="text-white/30">Cargando pedidos…</p>
      ) : orders.length === 0 ? (
        <p className="text-white/30">Aún no hay pedidos.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-left text-white/50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Comprador</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusInfo = STATUS_LABELS[order.status] ?? STATUS_LABELS.pending;
                return (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-xs text-white/40">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.buyerName}</p>
                      <p className="text-xs text-white/40">{order.buyerEmail}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-brand-orange">
                      {formatARS(order.totalArs)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusInfo.class}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/50">
                      {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
