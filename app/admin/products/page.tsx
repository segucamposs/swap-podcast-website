import type { Metadata } from "next";
import { AdminProductsClient } from "@/components/admin/AdminProductsClient";

export const metadata: Metadata = { title: "Productos" };

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}
