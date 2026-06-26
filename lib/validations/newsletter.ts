import { z } from "zod";

export const newsletterSchema = z.object({
  firstName: z
    .string()
    .min(1, "El nombre es obligatorio.")
    .max(50, "Nombre demasiado largo."),
  lastName: z
    .string()
    .min(1, "El apellido es obligatorio.")
    .max(50, "Apellido demasiado largo."),
  email: z
    .string()
    .min(1, "El email es obligatorio.")
    .email("Ingresá un email válido."),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
