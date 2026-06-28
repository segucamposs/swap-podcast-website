"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";

/**
 * Inner component that uses useSearchParams (requires Suspense boundary at build time).
 */
function SuccessContent() {
  const { clearCart } = useCart();
  const params = useSearchParams();
  const orderId = params.get("external_reference");

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <>
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 text-4xl">
        ✓
      </div>
      <h1 className="font-heading mb-3 text-3xl font-bold">¡Gracias por tu compra!</h1>
      <p className="max-w-md text-white/70">
        Tu pago fue aprobado. En breve te mandamos un email de confirmación.
        {orderId && (
          <span className="mt-2 block text-sm text-white/40">
            Pedido #{orderId.slice(0, 8).toUpperCase()}
          </span>
        )}
      </p>
    </>
  );
}

/**
 * /payment/success — Mercado Pago redirects here after a successful payment.
 * MP passes: payment_id, status, external_reference (= our order id)
 */
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <>
          <div className="mb-6 h-20 w-20 rounded-full bg-green-500/20" />
          <p className="text-white/50">Procesando confirmación…</p>
        </>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
