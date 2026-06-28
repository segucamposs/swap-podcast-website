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

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <section data-testid="empty-cart" className="flex-1 mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-8 px-4 py-32 text-center min-h-screen">
      <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/5 text-4xl">
        🛒
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="text-white/50">Explorá la tienda y agregá lo que te guste.</p>
      </div>
      <Link
        href="/store"
        className="rounded-full bg-brand-orange px-8 py-3 font-semibold text-black transition-opacity hover:opacity-90"
      >
        Ver tienda
      </Link>
    </section>
  );
}

// ─── Cart item row ────────────────────────────────────────────────────────────

function CartItemRow({
  item,
  onRemove,
}: {
  item: ReturnType<typeof useCart>["items"][number];
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-white/20">
      {/* Thumbnail */}
      <Link href={`/store/${item.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5 sm:h-24 sm:w-24">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl opacity-20">
            👕
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            <Link
              href={`/store/${item.slug}`}
              className="truncate font-semibold leading-tight hover:text-brand-orange transition-colors"
            >
              {item.name}
            </Link>
            {item.size && (
              <span className="inline-flex w-fit items-center rounded-md border border-white/15 bg-white/5 px-2 py-0.5 text-xs font-medium text-white/60">
                Talle: {item.size}
              </span>
            )}
          </div>
          <button
            data-testid="remove-item"
            onClick={onRemove}
            aria-label={`Eliminar ${item.name}`}
            className="shrink-0 rounded-lg p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
              <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <QuantityStepper productId={item.productId} size={item.size} quantity={item.quantity} />
          <span className="font-heading font-bold text-brand-orange">
            {formatARS(item.priceArs * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CartPageClient() {
  const { items, totalItems, totalArs, removeItem } = useCart();

  const [form, setForm] = useState<FormState>({ buyerName: "", buyerEmail: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  if (items.length === 0) return <EmptyCart />;

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

      window.location.href = data.initPoint;
    } catch {
      setErrors({ general: "Error de red. Chequeá tu conexión e intentá de nuevo." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flex-1 mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-baseline gap-3">
        <h1 className="font-heading text-3xl font-bold">Tu carrito</h1>
        <span className="text-lg text-white/40">
          {totalItems} {totalItems === 1 ? "producto" : "productos"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px]">
        {/* ── Item list ──────────────────────────────────────── */}
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartItemRow
              key={`${item.productId}-${item.size ?? ""}`}
              item={item}
              onRemove={() => removeItem(item.productId, item.size)}
            />
          ))}

          <Link
            href="/store"
            className="mt-2 flex items-center gap-2 self-start text-sm text-white/40 transition-colors hover:text-white/70"
          >
            ← Seguir comprando
          </Link>
        </div>

        {/* ── Order summary ──────────────────────────────────── */}
        <div className="flex flex-col gap-0 rounded-2xl border border-white/10 bg-white/[0.03] p-6 self-start lg:sticky lg:top-24">
          <h2 className="font-heading mb-5 text-lg font-semibold">Resumen del pedido</h2>

          {/* Line items */}
          <div className="flex flex-col gap-2 pb-4 border-b border-white/10">
            {items.map((item) => (
              <div key={`${item.productId}-${item.size ?? ""}`} className="flex justify-between gap-2 text-sm">
                <span className="text-white/60 truncate">
                  {item.name}
                  {item.size && <span className="ml-1 text-white/30">({item.size})</span>}
                  {item.quantity > 1 && <span className="ml-1 text-white/30">×{item.quantity}</span>}
                </span>
                <span className="shrink-0 font-medium">{formatARS(item.priceArs * item.quantity)}</span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between items-center py-4 border-b border-white/10">
            <span className="font-semibold">Total</span>
            <span data-testid="cart-total" className="font-heading text-xl font-bold text-brand-orange">
              {formatARS(totalArs)}
            </span>
          </div>

          {/* Buyer form */}
          <form onSubmit={handleCheckout} noValidate className="flex flex-col gap-4 pt-5">
            <p className="text-xs text-white/40">Tus datos para la confirmación</p>

            <div className="flex flex-col gap-1">
              <label htmlFor="buyerName" className="text-sm text-white/60">Nombre completo</label>
              <input
                id="buyerName"
                data-testid="buyer-name"
                type="text"
                autoComplete="name"
                value={form.buyerName}
                onChange={(e) => setForm((f) => ({ ...f, buyerName: e.target.value }))}
                aria-invalid={!!errors.buyerName}
                placeholder="Segu Campos"
                className={`rounded-xl border bg-white/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-brand-orange ${
                  errors.buyerName ? "border-red-500/60" : "border-white/15"
                }`}
              />
              {errors.buyerName && (
                <p data-testid="field-error" role="alert" className="text-xs text-red-400">{errors.buyerName}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="buyerEmail" className="text-sm text-white/60">Email</label>
              <input
                id="buyerEmail"
                data-testid="buyer-email"
                type="email"
                autoComplete="email"
                value={form.buyerEmail}
                onChange={(e) => setForm((f) => ({ ...f, buyerEmail: e.target.value }))}
                aria-invalid={!!errors.buyerEmail}
                placeholder="vos@ejemplo.com"
                className={`rounded-xl border bg-white/5 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-white/20 focus:border-brand-orange ${
                  errors.buyerEmail ? "border-red-500/60" : "border-white/15"
                }`}
              />
              {errors.buyerEmail && (
                <p data-testid="field-error" role="alert" className="text-xs text-red-400">{errors.buyerEmail}</p>
              )}
            </div>

            {errors.general && (
              <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-sm text-red-400">
                {errors.general}
              </p>
            )}

            <button
              type="submit"
              data-testid="checkout-submit"
              disabled={loading}
              className="mt-1 flex items-center justify-center gap-2 rounded-full bg-brand-orange py-3.5 font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  Procesando…
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                  Pagar con Mercado Pago
                </>
              )}
            </button>

            <p className="text-center text-xs text-white/25">
              Pago seguro · Los precios incluyen IVA
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
