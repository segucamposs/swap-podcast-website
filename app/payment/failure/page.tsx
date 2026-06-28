import Link from "next/link";

/**
 * /payment/failure — Mercado Pago redirects here after a rejected/failed payment.
 */
export default function PaymentFailurePage() {
  return (
    <>
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-4xl">
        ✕
      </div>
      <h1 className="font-heading mb-3 text-3xl font-bold">El pago no se completó</h1>
      <p className="mb-6 max-w-md text-white/70">
        Tu pago fue rechazado o cancelado. Podés volver al carrito e intentar de nuevo.
      </p>
      <Link
        href="/store/cart"
        className="rounded-full bg-brand-orange px-8 py-3 font-semibold text-black transition-opacity hover:opacity-90"
      >
        Volver al carrito
      </Link>
    </>
  );
}
