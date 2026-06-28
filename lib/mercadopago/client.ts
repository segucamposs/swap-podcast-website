import { MercadoPagoConfig, Preference } from "mercadopago";
import type { CartItem } from "@/lib/store/types";

/**
 * Returns a configured MercadoPagoConfig instance.
 * Throws if MP_ACCESS_TOKEN is not set (this runs server-side only).
 */
export function getMPConfig(): MercadoPagoConfig {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("MP_ACCESS_TOKEN is not configured");
  return new MercadoPagoConfig({ accessToken: token });
}

interface CreatePreferenceOptions {
  orderId: string;
  items: CartItem[];
  buyerEmail: string;
  buyerName: string;
}

/**
 * Creates a Mercado Pago Checkout Pro preference.
 * back_urls point to /payment/{success,failure,pending}.
 * notification_url points to the webhook route.
 *
 * Returns the preference init_point (the MP-hosted checkout URL).
 */
export async function createMPPreference({
  orderId,
  items,
  buyerEmail,
  buyerName,
}: CreatePreferenceOptions): Promise<{ initPoint: string; preferenceId: string }> {
  const config = getMPConfig();
  const preference = new Preference(config);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const isLocalhost = siteUrl.includes("localhost") || siteUrl.includes("127.0.0.1");

  const result = await preference.create({
    body: {
      external_reference: orderId,
      payer: { email: buyerEmail, name: buyerName },
      items: items.map((item) => ({
        id: item.productId,
        title: item.name,
        quantity: item.quantity,
        unit_price: Number(item.priceArs),  // MP requires a JS number, not a BigInt/string
        currency_id: "ARS",
      })),
      back_urls: {
        success: `${siteUrl}/payment/success`,
        failure: `${siteUrl}/payment/failure`,
        pending: `${siteUrl}/payment/pending`,
      },
      // auto_return + notification_url require public HTTPS URLs — omit on localhost
      ...(!isLocalhost && {
        auto_return: "approved" as const,
        notification_url: `${siteUrl}/api/webhooks/mercadopago`,
      }),
    },
  });

  if (!result.init_point || !result.id) {
    throw new Error("Mercado Pago did not return a valid preference");
  }

  return { initPoint: result.init_point, preferenceId: result.id };
}
