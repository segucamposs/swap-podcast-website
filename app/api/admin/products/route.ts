import { productSchema } from "@/lib/validations/store";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { toProductFromRaw } from "@/lib/store/products";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getAdminSession() {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ─── GET /api/admin/products ──────────────────────────────────────────────────
// Returns ALL products (active + inactive) for the admin panel.

export async function GET() {
  const user = await getAdminSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getSupabaseServiceClient();
  if (!supabase) return Response.json({ error: "Service unavailable" }, { status: 503 });

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[admin/products] GET error:", error.message);
    return Response.json({ error: "Error al cargar los productos." }, { status: 500 });
  }

  return Response.json(data.map(toProductFromRaw));
}

// ─── POST /api/admin/products ─────────────────────────────────────────────────
// Creates a new product.

export async function POST(request: Request) {
  const user = await getAdminSession();
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

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
    .insert({
      slug,
      name,
      description,
      price_ars:  priceArs,
      image_url:  imageUrl,
      stock,
      active,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return Response.json({ error: "Ya existe un producto con ese slug." }, { status: 409 });
    }
    console.error("[admin/products] POST error:", error.message);
    return Response.json({ error: "Error al crear el producto." }, { status: 500 });
  }

  return Response.json(toProductFromRaw(data), { status: 201 });
}
