"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/lib/store/types";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);

  const inCart = items.find((i) => i.productId === product.id);
  const outOfStock = product.stock === 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      slug:      product.slug,
      name:      product.name,
      priceArs:  product.priceArs,
      imageUrl:  product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (outOfStock) {
    return (
      <button disabled className="w-full rounded-full bg-white/10 py-4 text-lg font-semibold text-white/40 cursor-not-allowed">
        Sin stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      aria-live="polite"
      className="w-full rounded-full bg-brand-orange py-4 text-lg font-semibold text-black transition-opacity hover:opacity-90"
    >
      {added
        ? "✓ Agregado al carrito"
        : inCart
        ? `Agregar otro (${inCart.quantity} en carrito)`
        : "Agregar al carrito"}
    </button>
  );
}
