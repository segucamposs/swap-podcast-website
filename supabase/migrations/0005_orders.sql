-- Merch store orders and line items.
-- All access is via service-role key from API routes (no anon policies).
-- Admins can SELECT directly for the /admin/orders panel.

CREATE TABLE IF NOT EXISTS orders (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  status            TEXT        NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  total_ars         INT         NOT NULL CHECK (total_ars > 0),
  buyer_name        TEXT        NOT NULL,
  buyer_email       TEXT        NOT NULL,
  mp_preference_id  TEXT,
  mp_payment_id     TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id              UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID  NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id      UUID  NOT NULL REFERENCES products(id),
  product_name    TEXT  NOT NULL,   -- snapshot so renaming a product doesn't break history
  quantity        INT   NOT NULL CHECK (quantity > 0),
  unit_price_ars  INT   NOT NULL CHECK (unit_price_ars > 0),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);

-- RLS: no anon access — all mutations go through the service-role key in API routes.
-- Authenticated (admin) can read both tables for the admin panel.
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_auth_read" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "order_items_auth_read" ON order_items
  FOR SELECT USING (auth.role() = 'authenticated');

-- Auto-update updated_at on orders
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
