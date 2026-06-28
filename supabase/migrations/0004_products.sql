-- Merch store product catalog.
-- Active products are publicly visible; all writes are admin-only.

CREATE TABLE IF NOT EXISTS products (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT        UNIQUE NOT NULL,
  name        TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  price_ars   INT         NOT NULL CHECK (price_ars > 0),
  image_url   TEXT,
  stock       INT         NOT NULL DEFAULT 0 CHECK (stock >= 0),
  active      BOOLEAN     NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Customers can browse active products; admins manage everything
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (active = true);

CREATE POLICY "products_auth_write" ON products
  FOR ALL USING (auth.role() = 'authenticated');

-- Reuse the update_updated_at function defined in 0003_episode_links.sql
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
