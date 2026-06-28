"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

function getClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = getClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError("Credenciales incorrectas. Revisá tu email y contraseña.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Error de red. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm text-white/70">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-brand-orange"
          placeholder="admin@swap.com"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm text-white/70">Contraseña</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm outline-none focus:border-brand-orange"
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-full bg-brand-orange py-3 font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "Iniciando sesión…" : "Ingresar"}
      </button>
    </form>
  );
}
