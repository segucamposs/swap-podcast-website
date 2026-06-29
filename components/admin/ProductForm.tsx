"use client";

import { useState } from "react";
import { PRODUCT_CATEGORIES } from "@/lib/store/types";
import type { Product } from "@/lib/store/types";

interface ProductFormProps {
  initial?: Partial<Product>;
  onSave: (data: ProductFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface ProductFormData {
  slug: string;
  name: string;
  description: string;
  priceArs: number;
  imageUrl: string | null;
  stock: number;
  active: boolean;
  category: string;
}

export function ProductForm({ initial = {}, onSave, onCancel, loading }: ProductFormProps) {
  const [data, setData] = useState<ProductFormData>({
    slug:        initial.slug        ?? "",
    name:        initial.name        ?? "",
    description: initial.description ?? "",
    priceArs:    initial.priceArs    ?? 0,
    imageUrl:    initial.imageUrl    ?? null,
    stock:       initial.stock       ?? 0,
    active:      initial.active      ?? true,
    category:    initial.category    ?? "Varios",
  });
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await onSave(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar.");
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-brand-orange";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/70">Nombre *</label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            required
            className={inputClass}
            placeholder="Remera SWAP"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/70">Slug *</label>
          <input
            type="text"
            value={data.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            required
            pattern="^[a-z0-9-]+$"
            className={inputClass}
            placeholder="remera-swap"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/70">Precio (ARS) *</label>
          <input
            type="number"
            min={1}
            value={data.priceArs || ""}
            onChange={(e) => set("priceArs", parseInt(e.target.value, 10) || 0)}
            required
            className={inputClass}
            placeholder="15000"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/70">Stock *</label>
          <input
            type="number"
            min={0}
            value={data.stock}
            onChange={(e) => set("stock", parseInt(e.target.value, 10) || 0)}
            required
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-white/70">Categoría *</label>
          <select
            value={data.category}
            onChange={(e) => set("category", e.target.value)}
            required
            className={`${inputClass} cursor-pointer`}
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-neutral-900">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-white/70">Descripción</label>
        <textarea
          value={data.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Remera 100% algodón, logo SWAP bordado…"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-white/70">URL de imagen</label>
        <input
          type="url"
          value={data.imageUrl ?? ""}
          onChange={(e) => set("imageUrl", e.target.value || null)}
          className={inputClass}
          placeholder="https://…"
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-white/70">
        <input
          type="checkbox"
          checked={data.active}
          onChange={(e) => set("active", e.target.checked)}
          className="h-4 w-4 accent-brand-orange"
        />
        Producto activo (visible en la tienda)
      </label>

      {error && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-brand-orange px-6 py-2 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/20 px-6 py-2 text-sm transition-colors hover:border-white/40"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
