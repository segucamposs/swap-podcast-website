-- Add category column to products for storefront filtering.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT 'Accesorios';
