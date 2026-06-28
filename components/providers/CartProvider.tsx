"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { CartItem } from "@/lib/store/types";

const CART_KEY = "swap_cart";

// Items with the same productId but different sizes are separate cart entries.
function itemKey(productId: string, size: string | null) {
  return `${productId}|${size ?? ""}`;
}

// ─── Context shape ────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalArs: number;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string, size: string | null) => void;
  setQuantity: (productId: string, size: string | null, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (stored) setItems(JSON.parse(stored) as CartItem[]);
    } catch {
      // corrupted storage — start fresh
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((incoming: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const key = itemKey(incoming.productId, incoming.size);
      const existing = prev.find((i) => itemKey(i.productId, i.size) === key);
      if (existing) {
        return prev.map((i) =>
          itemKey(i.productId, i.size) === key
            ? { ...i, quantity: Math.min(i.quantity + 1, 10) }
            : i
        );
      }
      return [...prev, { ...incoming, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string, size: string | null) => {
    const key = itemKey(productId, size);
    setItems((prev) => prev.filter((i) => itemKey(i.productId, i.size) !== key));
  }, []);

  const setQuantity = useCallback((productId: string, size: string | null, quantity: number) => {
    const key = itemKey(productId, size);
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => itemKey(i.productId, i.size) !== key));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        itemKey(i.productId, i.size) === key
          ? { ...i, quantity: Math.min(quantity, 10) }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalArs   = items.reduce((sum, i) => sum + i.priceArs * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, totalItems, totalArs, addItem, removeItem, setQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
