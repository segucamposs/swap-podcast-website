"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/providers/CartProvider";
import type { Product } from "@/lib/store/types";

function formatARS(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const outOfStock = product.stock === 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      slug:      product.slug,
      name:      product.name,
      priceArs:  product.priceArs,
      imageUrl:  product.imageUrl,
    });
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-brand-orange/40">
      {/* Product image */}
      <Link href={`/store/${product.slug}`} className="relative block aspect-square overflow-hidden bg-white/5">
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
            <span className="text-5xl opacity-30">👕</span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white/70 backdrop-blur-sm">
              Sin stock
            </span>
          </div>
        )}
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Link href={`/store/${product.slug}`} className="font-heading text-lg font-semibold leading-tight hover:text-brand-orange transition-colors">
          {product.name}
        </Link>

        <p className="text-sm text-white/60 line-clamp-2">{product.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="font-heading text-xl font-bold text-brand-orange">
            {formatARS(product.priceArs)}
          </span>

          <button
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={`Agregar ${product.name} al carrito`}
            className="rounded-full bg-brand-orange px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {outOfStock ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </article>
  );
}
