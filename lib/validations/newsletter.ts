import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "El email es obligatorio.")
    .email("Ingresá un email válido."),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
