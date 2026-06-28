import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, getProducts } from "@/lib/store/products";
import { AddToCartButton } from "@/components/store/AddToCartButton";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { images: product.imageUrl ? [product.imageUrl] : undefined },
  };
}

function formatARS(amount: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <section className="flex-1 w-full min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-24">
      <div className="mx-auto w-full max-w-5xl grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-8xl opacity-20">👕</span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="font-heading text-3xl font-bold sm:text-4xl">{product.name}</h1>
            <p className="mt-1 text-3xl font-bold text-brand-orange">
              {formatARS(product.priceArs)}
            </p>
          </div>

          {product.description && (
            <p className="text-white/70 leading-relaxed">{product.description}</p>
          )}

          <div className="text-sm text-white/40">
            {product.stock > 0
              ? `${product.stock} unidades disponibles`
              : "Sin stock"}
          </div>

          <AddToCartButton product={product} />

          <p className="text-xs text-white/30">
            Pago seguro procesado por Mercado Pago. Recibís confirmación por email.
          </p>
        </div>
      </div>
    </section>
  );
}
