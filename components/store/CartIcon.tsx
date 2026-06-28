"use client";

import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";

export function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/store/cart"
      aria-label={`Carrito — ${totalItems} ${totalItems === 1 ? "producto" : "productos"}`}
      className="fixed bottom-[5.5rem] right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1c1c1e] shadow-lg transition-transform hover:scale-110"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={1.75}
        stroke="white"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>

      {totalItems > 0 && (
        <span
          data-testid="cart-count"
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[10px] font-bold text-black"
        >
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
