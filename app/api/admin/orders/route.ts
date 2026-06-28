import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { Order } from "@/lib/store/types";

async function getAdminSession() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

type RawOrder = {
  id: string;
  status: string;
  total_ars: number;
  buyer_name: string;
  buyer_email: string;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  created_at: string;
  updated_at: string;
};

/**
 * GET /api/admin/orders
 * Returns all orders sorted by newest first (admin only).
 */
export async function GET() {
  const user = await getAdminSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServiceClient();
  if (!supabase) return Response.json({ error: "Service unavailable" }, { status: 503 });

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/orders] GET error:", error.message);
    return Response.json({ error: "Error al cargar los pedidos." }, { status: 500 });
  }

  const orders: Order[] = (data as RawOrder[]).map((row) => ({
    id:             row.id,
    status:         row.status as Order["status"],
    totalArs:       row.total_ars,
    buyerName:      row.buyer_name,
    buyerEmail:     row.buyer_email,
    mpPreferenceId: row.mp_preference_id,
    mpPaymentId:    row.mp_payment_id,
    createdAt:      row.created_at,
    updatedAt:      row.updated_at,
  }));

  return Response.json(orders);
}
