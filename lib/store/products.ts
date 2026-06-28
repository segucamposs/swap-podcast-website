import { getSupabaseClient } from "@/lib/supabase/client";
import type { Product } from "@/lib/store/types";

type RawProduct = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_ars: number;
  image_url: string | null;
  stock: number;
  active: boolean;
  created_at: string;
  updated_at: string;
};

function toProduct(raw: RawProduct): Product {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    priceArs: raw.price_ars,
    imageUrl: raw.image_url ?? null,
    stock: raw.stock,
    active: raw.active,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  } satisfies Product;
}

/**
 * Returns all active products, ordered by name.
 * Returns [] if Supabase is not configured or the fetch fails.
 */
export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("[products] getProducts error:", error.message);
    return [];
  }

  return (data as RawProduct[]).map(toProduct);
}

/**
 * Returns a single active product by slug, or null if not found.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      // PGRST116 = no rows found — not a real error
      console.error("[products] getProductBySlug error:", error.message);
    }
    return null;
  }

  return toProduct(data as RawProduct);
}

/**
 * Returns ALL products (active + inactive) for the admin panel.
 * Caller must use the service-role client — this helper just shapes the data.
 */
export function toProductFromRaw(raw: RawProduct): Product {
  return toProduct(raw);
}
