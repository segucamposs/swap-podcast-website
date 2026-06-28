import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = { title: "Iniciar sesión" };

export default function AdminLoginPage() {
  return (
    <div className="flex w-full items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-heading text-2xl font-bold text-brand-orange">SWAP</span>
          <h1 className="mt-1 text-lg font-semibold text-white/80">Panel de administración</h1>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
