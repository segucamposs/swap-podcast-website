import type { Metadata } from "next";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export const metadata: Metadata = { title: "Pedidos" };

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
