"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import { QuantityStepper } from "@/components/store/QuantityStepper";

function formatARS(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface FormState {
  buyerName: string;
  buyerEmail: string;
}

interface FormErrors {
  buyerName?: string;
  buyerEmail?: string;
  general?: string;
}

export function CartPageClient() {
  const { items, totalItems, totalArs, removeItem } = useCart();

  const [form, setForm] = useState<FormState>({ buyerName: "", buyerEmail: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  // ─── Empty cart ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <section className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
        <h1 className="font-heading text-3xl font-bold">Tu carrito está vacío</h1>
        <p className="text-white/60">Explorá la tienda y agregá algo que te guste.</p>
        <Link
          href="/store"
          className="rounded-full bg-brand-orange px-8 py-3 font-semibold text-black transition-opacity hover:opacity-90"
        >
          Ver tienda
        </Link>
      </section>
    );
  }

  // ─── Validation ────────────────────────────────────────────────────────────
  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.buyerName.trim()) next.buyerName = "El nombre es obligatorio.";
    if (!form.buyerEmail.trim()) {
      next.buyerEmail = "El email es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.buyerEmail)) {
      next.buyerEmail = "Ingresá un email válido.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ─── Checkout ──────────────────────────────────────────────────────────────
  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });

      const data = await res.json() as { initPoint?: string; error?: string };

      if (!res.ok || !data.initPoint) {
        setErrors({ general: data.error ?? "Hubo un error. Intentá de nuevo." });
        return;
      }

      // Redirect to Mercado Pago hosted checkout
      window.location.href = data.initPoint;
    } catch {
      setErrors({ general: "Error de red. Chequeá tu conexión e intentá de nuevo." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="font-heading mb-10 text-3xl font-bold">
        Tu carrito <span className="text-brand-orange">({totalItems} {totalItems === 1 ? "producto" : "productos"})</span>
      </h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* ── Item list ─────────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              {/* Thumbnail */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white/5">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl opacity-30">
                    👕
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/store/${item.slug}`}
                    className="font-semibold leading-tight hover:text-brand-orange transition-colors"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Eliminar ${item.name}`}
                    className="shrink-0 text-white/30 hover:text-red-400 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <QuantityStepper productId={item.productId} quantity={item.quantity} />
                  <span className="font-semibold text-brand-orange">
                    {formatARS(item.priceArs * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Summary + form ────────────────────────────────── */}
        <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 self-start">
          <h2 className="font-heading text-xl font-semibold">Resumen</h2>

          <div className="flex justify-between text-white/70">
            <span>Subtotal</span>
            <span className="font-semibold text-white">{formatARS(totalArs)}</span>
          </div>

          <hr className="border-white/10" />

          {/* Buyer info form */}
          <form onSubmit={handleCheckout} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="buyerName" className="text-sm text-white/70">
                Nombre completo
              </label>
              <input
                id="buyerName"
                type="text"
                autoComplete="name"
                value={form.buyerName}
                onChange={(e) => setForm((f) => ({ ...f, buyerName: e.target.value }))}
                aria-describedby={errors.buyerName ? "buyerName-error" : undefined}
                aria-invalid={!!errors.buyerName}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-brand-orange placeholder:text-white/30"
                placeholder="Segu Campos"
              />
              {errors.buyerName && (
                <p id="buyerName-error" role="alert" className="text-xs text-red-400">
                  {errors.buyerName}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="buyerEmail" className="text-sm text-white/70">
                Email
              </label>
              <input
                id="buyerEmail"
                type="email"
                autoComplete="email"
                value={form.buyerEmail}
                onChange={(e) => setForm((f) => ({ ...f, buyerEmail: e.target.value }))}
                aria-describedby={errors.buyerEmail ? "buyerEmail-error" : undefined}
                aria-invalid={!!errors.buyerEmail}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-brand-orange placeholder:text-white/30"
                placeholder="vos@ejemplo.com"
              />
              {errors.buyerEmail && (
                <p id="buyerEmail-error" role="alert" className="text-xs text-red-400">
                  {errors.buyerEmail}
                </p>
              )}
            </div>

            {errors.general && (
              <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {errors.general}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand-orange py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  Procesando…
                </>
              ) : (
                "Pagar con Mercado Pago"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-white/30">
            Pago seguro · Los precios incluyen IVA
          </p>
        </div>
      </div>
    </section>
  );
}
