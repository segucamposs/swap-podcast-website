-- Add sizes array to products (null = no size selector, e.g. stickers)
ALTER TABLE products ADD COLUMN IF NOT EXISTS sizes text[] DEFAULT NULL;

-- Add size to order_items (null for products without size)
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS size text DEFAULT NULL;

-- Set sizes for each product
UPDATE products SET sizes = ARRAY['S','M','L','XL'] WHERE slug IN ('hoodie-swap','crewneck-swap','remera-swap');
UPDATE products SET sizes = ARRAY['única'] WHERE slug = 'gorra-swap';
-- stickers-swap stays NULL
