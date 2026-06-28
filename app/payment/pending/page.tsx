/**
 * /payment/pending — Mercado Pago redirects here when a payment is still being processed
 * (e.g. efectivo / bank transfer methods).
 */
export default function PaymentPendingPage() {
  return (
    <>
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-yellow-500/20 text-4xl">
        ⏳
      </div>
      <h1 className="font-heading mb-3 text-3xl font-bold">Pago en proceso</h1>
      <p className="max-w-md text-white/70">
        Tu pago está siendo procesado. Te vamos a avisar por email cuando se confirme.
        Este proceso puede tardar hasta 2 días hábiles.
      </p>
    </>
  );
}
