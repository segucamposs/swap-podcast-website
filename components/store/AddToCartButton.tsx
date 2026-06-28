"use client";

import { useState } from "react";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/lib/store/types";

interface AddToCartButtonProps {
  product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock === 0;
  const needsSize = product.sizes && product.sizes.length > 0;
  const canAdd = !outOfStock && (!needsSize || selectedSize !== null);

  function handleAdd() {
    if (!canAdd) return;
    addItem({
      productId: product.id,
      slug:      product.slug,
      name:      product.name,
      priceArs:  product.priceArs,
      imageUrl:  product.imageUrl,
      size:      selectedSize,
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
    <div className="flex flex-col gap-4">
      {/* Size selector */}
      {needsSize && (
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-white/60">
            Talle
            {!selectedSize && (
              <span className="ml-2 text-xs text-brand-orange">— seleccioná uno</span>
            )}
          </span>
          <div className="flex flex-wrap gap-2">
            {product.sizes!.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                className={`min-w-[52px] rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-150 ${
                  selectedSize === size
                    ? "border-brand-orange bg-brand-orange text-black"
                    : "border-white/20 bg-white/5 text-white hover:border-white/50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add to cart button */}
      <button
        data-testid="add-to-cart"
        onClick={handleAdd}
        disabled={!canAdd}
        aria-live="polite"
        className="w-full rounded-full py-4 text-lg font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 bg-brand-orange text-black hover:opacity-90"
      >
        {added
          ? "✓ Agregado al carrito"
          : needsSize && !selectedSize
          ? "Seleccioná un talle"
          : "Agregar al carrito"}
      </button>
    </div>
  );
}
