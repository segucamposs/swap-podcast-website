import { z } from "zod";

// ─── Cart item ────────────────────────────────────────────────────────────────

export const cartItemSchema = z.object({
  productId: z.string().uuid("ID de producto inválido."),
  slug:      z.string().min(1),
  name:      z.string().min(1),
  priceArs:  z.number().int().positive("El precio debe ser positivo."),
  imageUrl:  z.string().url().nullable(),
  quantity:  z.number().int().min(1, "La cantidad mínima es 1.").max(10, "Máximo 10 unidades por producto."),
});

export type CartItemInput = z.infer<typeof cartItemSchema>;

// ─── Checkout ─────────────────────────────────────────────────────────────────

export const checkoutSchema = z.object({
  buyerName:  z.string().min(1, "El nombre es obligatorio.").max(100),
  buyerEmail: z.string().min(1, "El email es obligatorio.").email("Ingresá un email válido."),
  items:      z.array(cartItemSchema).min(1, "El carrito está vacío."),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

// ─── Admin — product CRUD ─────────────────────────────────────────────────────

export const productSchema = z.object({
  slug:        z.string()
                 .min(1, "El slug es obligatorio.")
                 .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones."),
  name:        z.string().min(1, "El nombre es obligatorio.").max(120),
  description: z.string().max(1000).default(""),
  priceArs:    z.number().int().positive("El precio debe ser mayor a 0."),
  imageUrl:    z.string().url("URL de imagen inválida.").nullable().default(null),
  stock:       z.number().int().min(0, "El stock no puede ser negativo.").default(0),
  active:      z.boolean().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;
