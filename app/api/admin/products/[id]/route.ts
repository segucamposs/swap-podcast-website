import { productSchema } from "@/lib/validations/store";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { toProductFromRaw } from "@/lib/store/products";

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getAdminSession() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

interface Params {
  params: Promise<{ id: string }>;
}

// ─── PUT /api/admin/products/[id] ─────────────────────────────────────────────
// Updates an existing product.

export async function PUT(request: Request, { params }: Params) {
  const user = await getAdminSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Cuerpo de solicitud inválido." }, { status: 400 });
  }

  const result = productSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: result.error.issues[0]?.message ?? "Datos inválidos." },
      { status: 400 }
    );
  }

  const { slug, name, description, priceArs, imageUrl, stock, active } = result.data;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return Response.json({ error: "Service unavailable" }, { status: 503 });

  const { data, error } = await supabase
    .from("products")
    .update({ slug, name, description, price_ars: priceArs, image_url: imageUrl, stock, active })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return Response.json({ error: "Producto no encontrado." }, { status: 404 });
    }
    if (error.code === "23505") {
      return Response.json({ error: "Ya existe un producto con ese slug." }, { status: 409 });
    }
    console.error("[admin/products/[id]] PUT error:", error.message);
    return Response.json({ error: "Error al actualizar el producto." }, { status: 500 });
  }

  return Response.json(toProductFromRaw(data));
}

// ─── DELETE /api/admin/products/[id] ─────────────────────────────────────────
// Soft-deletes a product by setting active = false.

export async function DELETE(_request: Request, { params }: Params) {
  const user = await getAdminSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const supabase = getSupabaseServiceClient();
  if (!supabase) return Response.json({ error: "Service unavailable" }, { status: 503 });

  const { error } = await supabase
    .from("products")
    .update({ active: false })
    .eq("id", id);

  if (error) {
    console.error("[admin/products/[id]] DELETE error:", error.message);
    return Response.json({ error: "Error al eliminar el producto." }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
