import { checkoutSchema } from "@/lib/validations/store";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { createMPPreference } from "@/lib/mercadopago/client";

/**
 * POST /api/checkout
 *
 * Receives the cart + buyer info, recomputes all prices from the DB
 * (never trusts client-side amounts), creates an order in Supabase,
 * creates a Mercado Pago preference, and returns the init_point URL.
 */
export async function POST(request: Request) {
  // ── 1. Parse body ──────────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  // ── 2. Validate shape ──────────────────────────────────────────────────────
  const result = checkoutSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: result.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 }
    );
  }

  const { buyerName, buyerEmail, items } = result.data;

  // ── 3. Supabase service client ─────────────────────────────────────────────
  const supabase = getSupabaseServiceClient();
  if (!supabase) {
    return Response.json({ error: "El servicio no está disponible ahora mismo." }, { status: 503 });
  }

  // ── 4. Re-fetch prices from DB (never trust the client) ───────────────────
  const productIds = items.map((i) => i.productId);
  const { data: dbProducts, error: fetchError } = await supabase
    .from("products")
    .select("id, name, price_ars, stock, active")
    .in("id", productIds);

  if (fetchError || !dbProducts) {
    console.error("[checkout] product fetch error:", fetchError?.message);
    return Response.json({ error: "Error al verificar los productos." }, { status: 500 });
  }

  // Build a map for O(1) lookup
  const productMap = new Map(dbProducts.map((p) => [p.id, p]));

  // Validate each cart item against DB
  for (const item of items) {
    const dbProduct = productMap.get(item.productId);
    if (!dbProduct || !dbProduct.active) {
      return Response.json(
        { error: `El producto "${item.name}" ya no está disponible.` },
        { status: 400 }
      );
    }
    if (dbProduct.stock < item.quantity) {
      return Response.json(
        { error: `Stock insuficiente para "${item.name}". Quedan ${dbProduct.stock} unidades.` },
        { status: 400 }
      );
    }
  }

  // Compute total from DB prices
  const verifiedItems = items.map((item) => {
    const dbProduct = productMap.get(item.productId)!;
    return { ...item, priceArs: dbProduct.price_ars as number, name: dbProduct.name as string };
  });

  const totalArs = verifiedItems.reduce(
    (sum, i) => sum + i.priceArs * i.quantity,
    0
  );

  // ── 5. Create order in Supabase ────────────────────────────────────────────
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      status:      "pending",
      total_ars:   totalArs,
      buyer_name:  buyerName,
      buyer_email: buyerEmail,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("[checkout] order insert error:", orderError?.message);
    return Response.json({ error: "No se pudo crear el pedido." }, { status: 500 });
  }

  const orderId = order.id as string;

  // Insert order items
  const orderItems = verifiedItems.map((item) => ({
    order_id:       orderId,
    product_id:     item.productId,
    product_name:   item.name,
    quantity:       item.quantity,
    unit_price_ars: item.priceArs,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) {
    console.error("[checkout] order_items insert error:", itemsError.message);
    // Don't fail the request — order exists, items partial. Log and continue.
  }

  // ── 6. Create Mercado Pago preference ─────────────────────────────────────
  let initPoint: string;
  let preferenceId: string;

  try {
    const mp = await createMPPreference({
      orderId,
      items: verifiedItems,
      buyerEmail,
      buyerName,
    });
    initPoint    = mp.initPoint;
    preferenceId = mp.preferenceId;
  } catch (err) {
    console.error("[checkout] MP preference error (full):", JSON.stringify(err, null, 2));
    return Response.json(
      {
        error: "No se pudo iniciar el pago. Intentá de nuevo.",
        ...(process.env.NODE_ENV !== "production" && { detail: err }),
      },
      { status: 502 }
    );
  }

  // Store the preference ID on the order
  await supabase
    .from("orders")
    .update({ mp_preference_id: preferenceId })
    .eq("id", orderId);

  // ── 7. Return init_point ───────────────────────────────────────────────────
  return Response.json({ initPoint, orderId }, { status: 201 });
}
