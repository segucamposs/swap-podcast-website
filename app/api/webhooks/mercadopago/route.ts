import { MercadoPagoConfig, Payment } from "mercadopago";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/webhooks/mercadopago
 *
 * Receives payment notifications from Mercado Pago.
 * Always responds 200 fast (MP retries on non-2xx).
 *
 * On a payment.updated / payment.created event:
 *  - Fetches the payment from MP to verify status
 *  - Updates orders.status and mp_payment_id
 *  - Decrements stock on "approved" payments
 */
export async function POST(request: Request) {
  // ── 1. Parse notification ──────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response("ok", { status: 200 });
  }

  const topic  = body.topic ?? body.type;
  const dataId = (body.data as Record<string, unknown> | undefined)?.id ?? body["data.id"];

  // Only handle payment events
  if (topic !== "payment" && topic !== "payment.created" && topic !== "payment.updated") {
    return new Response("ok", { status: 200 });
  }

  if (!dataId || typeof dataId !== "string") {
    return new Response("ok", { status: 200 });
  }

  // ── 2. Fetch payment from MP ───────────────────────────────────────────────
  const mpToken = process.env.MP_ACCESS_TOKEN;
  if (!mpToken) {
    console.error("[webhook] MP_ACCESS_TOKEN not configured");
    return new Response("ok", { status: 200 });
  }

  let payment: Record<string, unknown>;
  try {
    const config  = new MercadoPagoConfig({ accessToken: mpToken });
    const paymentClient = new Payment(config);
    payment = (await paymentClient.get({ id: dataId })) as unknown as Record<string, unknown>;
  } catch (err) {
    console.error("[webhook] Failed to fetch MP payment:", err);
    return new Response("ok", { status: 200 });
  }

  const mpStatus       = payment.status as string | undefined;
  const externalRef    = payment.external_reference as string | undefined;
  const mpPaymentId    = String(dataId);

  if (!externalRef) {
    return new Response("ok", { status: 200 });
  }

  // Map MP status → our order status
  const statusMap: Record<string, string> = {
    approved:     "paid",
    rejected:     "failed",
    cancelled:    "cancelled",
    in_process:   "pending",
    pending:      "pending",
    authorized:   "pending",
    in_mediation: "pending",
    charged_back: "failed",
  };

  const orderStatus = statusMap[mpStatus ?? ""] ?? "pending";

  // ── 3. Update order in Supabase ────────────────────────────────────────────
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    console.error("[webhook] Supabase not configured");
    return new Response("ok", { status: 200 });
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: orderStatus, mp_payment_id: mpPaymentId })
    .eq("id", externalRef);

  if (updateError) {
    console.error("[webhook] Failed to update order:", updateError.message);
    return new Response("ok", { status: 200 });
  }

  // ── 4. Decrement stock on paid orders ──────────────────────────────────────
  if (orderStatus === "paid") {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", externalRef);

    if (orderItems) {
      for (const item of orderItems as { product_id: string; quantity: number }[]) {
        await supabase.rpc("decrement_stock", {
          p_product_id: item.product_id,
          p_quantity:   item.quantity,
        });
      }
    }
  }

  return new Response("ok", { status: 200 });
}
