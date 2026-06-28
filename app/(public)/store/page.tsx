import type { Metadata } from "next";
import { getProducts } from "@/lib/store/products";
import { ProductGrid } from "@/components/store/ProductGrid";

export const metadata: Metadata = {
  title: "Merch",
  description: "La merch oficial de SWAP Podcast. Representá el movimiento.",
};

export const revalidate = 60; // ISR — revalidate every minute

export default async function StorePage() {
  const products = await getProducts();

  return (
    <section className="flex-1 mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Merch <span className="text-brand-orange">SWAP</span>
        </h1>
        <p className="mt-4 text-white/60">
          Representá el movimiento. Cada compra apoya el podcast directamente.
        </p>
      </div>

      <ProductGrid products={products} />
    </section>
  );
}
