"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";

export function CartIcon() {
  const { totalItems } = useCart();
  const hasItems = totalItems > 0;

  return (
    <Link
      href="/store/cart"
      aria-label={`Carrito — ${totalItems} ${totalItems === 1 ? "producto" : "productos"}`}
      data-testid="cart-count-link"
      className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200 ${
        hasItems
          ? "border-brand-orange/60 bg-brand-orange/10 hover:border-brand-orange hover:bg-brand-orange/20"
          : "border-white/15 bg-white/5 hover:border-white/40 hover:bg-white/10"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={hasItems ? 2 : 1.5}
        stroke={hasItems ? "#ff751f" : "currentColor"}
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
        />
      </svg>

      {hasItems && (
        <span
          data-testid="cart-count"
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-black shadow-[0_0_8px_rgba(255,117,31,0.6)]"
        >
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
