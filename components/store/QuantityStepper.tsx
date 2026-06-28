"use client";

import { useCart } from "@/components/providers/CartProvider";

interface QuantityStepperProps {
  productId: string;
  quantity: number;
}

export function QuantityStepper({ productId, quantity }: QuantityStepperProps) {
  const { setQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() =>
          quantity <= 1 ? removeItem(productId) : setQuantity(productId, quantity - 1)
        }
        aria-label="Reducir cantidad"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-lg leading-none hover:border-brand-orange hover:text-brand-orange transition-colors"
      >
        −
      </button>
      <span className="min-w-[2ch] text-center font-semibold tabular-nums">{quantity}</span>
      <button
        onClick={() => setQuantity(productId, quantity + 1)}
        disabled={quantity >= 10}
        aria-label="Aumentar cantidad"
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-lg leading-none hover:border-brand-orange hover:text-brand-orange transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        +
      </button>
    </div>
  );
}
