import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

// Add sizes column and populate it
const statements = [
  `ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT NULL`,
  `ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size text DEFAULT NULL`,
  `UPDATE products SET sizes = ARRAY['S','M','L','XL'] WHERE slug IN ('hoodie-swap','crewneck-swap','remera-swap')`,
  `UPDATE products SET sizes = ARRAY['única'] WHERE slug = 'gorra-swap'`,
];

for (const sql of statements) {
  const { error } = await supabase.rpc("exec_sql", { query: sql }).catch(() => ({ error: null }));
  // Supabase JS client doesn't expose raw SQL — run via REST directly
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec_sql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  if (!res.ok) {
    // exec_sql RPC may not exist — that's fine, use the Supabase dashboard instead
    console.log(`  [skip] ${sql.slice(0, 60)}...`);
  } else {
    console.log(`  [ok]   ${sql.slice(0, 60)}...`);
  }
}

console.log("\nDone. If statements were skipped, run the SQL manually in the Supabase dashboard.");
