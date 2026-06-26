import { newsletterSchema } from "@/lib/validations/newsletter";
import { getSupabaseClient } from "@/lib/supabase/client";

export async function POST(request: Request) {
  // Parse + validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Request body inválido." },
      { status: 400 }
    );
  }

  const result = newsletterSchema.safeParse(body);
  if (!result.success) {
    return Response.json(
      { error: result.error.issues[0]?.message ?? "Email inválido." },
      { status: 400 }
    );
  }

  const { email } = result.data;

  // Graceful degradation if Supabase isn't wired up yet
  const supabase = getSupabaseClient();
  if (!supabase) {
    return Response.json(
      { error: "El newsletter todavía está siendo configurado. ¡Gracias por tu interés!" },
      { status: 503 }
    );
  }

  // Insert — Supabase will throw a unique-violation error for duplicates
  const { error } = await supabase
    .from("subscribers")
    .insert({ email: email.toLowerCase() });

  if (error) {
    // Postgres unique violation code
    if (error.code === "23505") {
      return Response.json(
        { error: "Ese email ya está suscripto." },
        { status: 409 }
      );
    }
    console.error("[newsletter] Supabase error:", error);
    return Response.json(
      { error: "No se pudo guardar el email. Intentá de nuevo." },
      { status: 500 }
    );
  }

  return Response.json(
    { message: "¡Suscripción exitosa!" },
    { status: 201 }
  );
}
