/**
 * Seed script: uploads product images to Supabase Storage and inserts
 * product rows into the `products` table.
 *
 * Usage:
 *   node --env-file=.env.local scripts/seed-products.mjs
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join } from "path";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const IMAGE_SOURCE = "/Users/segucampos/pw-e-commerce/public/assets/products";
const BUCKET = "product-images";

const products = [
  {
    slug: "hoodie-swap",
    name: "Hoodie SWAP",
    description:
      "Buzo con capucha premium. Tela 100% algodón pesado, bolsillo canguro y logo SWAP bordado en el pecho. Negro.",
    price_ars: 38000,
    stock: 20,
    file: "swap-hoodie.png",
  },
  {
    slug: "crewneck-swap",
    name: "Crewneck SWAP",
    description:
      "Buzo cuello redondo clásico. Algodón 320gsm, logo SWAP en el pecho. Perfecto para el día a día.",
    price_ars: 29000,
    stock: 15,
    file: "swap-crewneck.png",
  },
  {
    slug: "remera-swap",
    name: "Remera SWAP",
    description:
      "Remera oversize 100% algodón. Logo SWAP en naranja sobre negro. Talle único amplio.",
    price_ars: 18000,
    stock: 30,
    file: "swap-tee-negra.png",
  },
  {
    slug: "gorra-swap",
    name: "Gorra SWAP",
    description:
      "Gorra 5 paneles con logo SWAP bordado. Cierre ajustable. Negra.",
    price_ars: 14000,
    stock: 25,
    file: "swap-gorra.png",
  },
  {
    slug: "stickers-swap",
    name: "Pack Stickers SWAP",
    description:
      "Pack de 4 stickers troquelados con diseños exclusivos de SWAP Podcast. Vinilo resistente al agua.",
    price_ars: 3500,
    stock: 100,
    file: "swap-stickers.png",
  },
];

async function uploadImage(file) {
  const filePath = join(IMAGE_SOURCE, file);
  const fileBuffer = readFileSync(filePath);
  const storagePath = file;

  // Remove existing file if it exists (idempotent re-runs)
  await supabase.storage.from(BUCKET).remove([storagePath]);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: "image/png",
      upsert: true,
    });

  if (error) {
    throw new Error(`Upload failed for ${file}: ${error.message}`);
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

async function main() {
  console.log("Seeding SWAP merch products...\n");

  for (const product of products) {
    process.stdout.write(`  [${product.slug}] Uploading image...`);
    const image_url = await uploadImage(product.file);
    console.log(" done.");

    process.stdout.write(`  [${product.slug}] Inserting product...`);
    const { error } = await supabase.from("products").upsert(
      {
        slug: product.slug,
        name: product.name,
        description: product.description,
        price_ars: product.price_ars,
        image_url,
        stock: product.stock,
        active: true,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`\n  ERROR: ${error.message}`);
      continue;
    }
    console.log(` done. (ARS $${product.price_ars.toLocaleString("es-AR")})`);
  }

  console.log("\nAll products seeded successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
