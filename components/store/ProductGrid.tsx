"use client";

import { useState } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCT_CATEGORIES } from "@/lib/store/types";
import type { Product } from "@/lib/store/types";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const categories = ["Todo", ...PRODUCT_CATEGORIES];
  const [active, setActive] = useState("Todo");

  const filtered = active === "Todo" ? products : products.filter((p) => p.category === active);

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-white/50">Próximamente nuevos productos.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all duration-200 ${
              active === cat
                ? "bg-brand-orange text-black"
                : "border border-white/20 text-white/60 hover:border-white/40 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-white/40">No hay productos en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
