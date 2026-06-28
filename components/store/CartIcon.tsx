"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";

export function CartIcon() {
  const { totalItems } = useCart();
  const pathname = usePathname();

  if (!pathname.startsWith("/store")) return null;

  return (
    <Link
      href="/store/cart"
      aria-label={`Carrito — ${totalItems} ${totalItems === 1 ? "producto" : "productos"}`}
      className="fixed bottom-[5.5rem] right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#1c1c1e] shadow-lg transition-transform hover:scale-110"
    >
      {/* Filled shopping bag — bold, legible at small sizes */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="h-[22px] w-[22px]"
        aria-hidden="true"
      >
        <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zm-9-1a2 2 0 0 1 4 0v1h-4V6zm8 13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v10z" />
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
