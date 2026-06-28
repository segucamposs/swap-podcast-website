import type { Metadata } from "next";
import { CartPageClient } from "@/components/store/CartPageClient";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisá tu carrito y finalizá tu compra.",
};

export default function CartPage() {
  return <CartPageClient />;
}
