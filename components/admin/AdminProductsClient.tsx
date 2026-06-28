"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import type { ProductFormData } from "@/components/admin/ProductForm";
import type { Product } from "@/lib/store/types";

function formatARS(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function AdminProductsClient() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true); // start true — avoid sync setState in effect
  const [saving, setSaving]       = useState(false);
  const [editing, setEditing]     = useState<Product | null | "new">(null);

  const fetchProducts = useCallback(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/products");
        if (active && res.ok) setProducts(await res.json() as Product[]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => fetchProducts(), [fetchProducts]);

  async function handleSave(data: ProductFormData) {
    setSaving(true);
    try {
      const isNew = editing === "new";
      const id    = isNew ? null : (editing as Product).id;
      const url   = isNew ? "/api/admin/products" : `/api/admin/products/${id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json() as { error?: string };
        throw new Error(json.error ?? "Error al guardar.");
      }

      setEditing(null);
      await fetchProducts();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`¿Desactivar "${product.name}"? Seguirá en el historial de pedidos.`)) return;

    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (res.ok) await fetchProducts();
  }

  // ── Editing panel ──────────────────────────────────────────────────────────
  if (editing !== null) {
    return (
      <AdminShell title={editing === "new" ? "Nuevo producto" : "Editar producto"}>
        <ProductForm
          initial={editing === "new" ? {} : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          loading={saving}
        />
      </AdminShell>
    );
  }

  // ── Product list ───────────────────────────────────────────────────────────
  return (
    <AdminShell title="Productos">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-white/50">
          {loading ? "Cargando…" : `${products.length} producto${products.length !== 1 ? "s" : ""}`}
        </p>
        <button
          onClick={() => setEditing("new")}
          className="rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
        >
          + Nuevo producto
        </button>
      </div>

      {loading ? (
        <p className="text-white/30">Cargando productos…</p>
      ) : products.length === 0 ? (
        <p className="text-white/30">No hay productos todavía.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="border-b border-white/10 text-left text-white/50">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.imageUrl ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white/5">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xl">
                          👕
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-white/40">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-orange">
                    {formatARS(product.priceArs)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.stock === 0 ? "text-red-400" : "text-white"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.active
                          ? "bg-green-500/10 text-green-400"
                          : "bg-white/10 text-white/40"
                      }`}
                    >
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(product)}
                        className="rounded-lg px-3 py-1 text-xs text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        Editar
                      </button>
                      {product.active && (
                        <button
                          onClick={() => handleDelete(product)}
                          className="rounded-lg px-3 py-1 text-xs text-red-400/60 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                        >
                          Desactivar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
