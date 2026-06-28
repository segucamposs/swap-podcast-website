"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/store/types";

function formatARS(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock === 0;

  return (
    <Link
      href={`/store/${product.slug}`}
      data-testid="product-card"
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-brand-orange/50 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(255,117,31,0.12)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-white/5">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl opacity-20">👕</span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/70 backdrop-blur-sm">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <span data-testid="product-name" className="font-heading text-base font-semibold leading-tight group-hover:text-brand-orange transition-colors">
            {product.name}
          </span>
          {product.sizes && product.sizes.length > 0 && (
            <span className="text-xs text-white/40">
              {product.sizes.join(" · ")}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <span data-testid="product-price" className="font-heading text-lg font-bold text-brand-orange">
            {formatARS(product.priceArs)}
          </span>
          <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium text-white/60 transition-colors group-hover:border-brand-orange/50 group-hover:text-brand-orange">
            Ver →
          </span>
        </div>
      </div>
    </Link>
  );
}
