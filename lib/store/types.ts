/** A product in the Supabase `products` table. */
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  priceArs: number;
  imageUrl: string | null;
  stock: number;
  active: boolean;
  sizes: string[] | null;
  createdAt: string;
  updatedAt: string;
}

/** A row in `orders`. */
export interface Order {
  id: string;
  status: "pending" | "paid" | "failed" | "cancelled";
  totalArs: number;
  buyerName: string;
  buyerEmail: string;
  mpPreferenceId: string | null;
  mpPaymentId: string | null;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}

/** A row in `order_items`. */
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  size: string | null;
  quantity: number;
  unitPriceArs: number;
  createdAt: string;
}

/** In-memory cart item (persisted in localStorage). */
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceArs: number;
  imageUrl: string | null;
  size: string | null;
  quantity: number;
}
