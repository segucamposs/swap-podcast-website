"use client";

import { useState } from "react";

const DRAFT_KEY = "swap_newsletter_draft";

type Status = "idle" | "loading" | "success" | "error";

interface Draft {
  firstName: string;
  lastName: string;
  email: string;
}

function loadDraft(): Draft {
  if (typeof window === "undefined") return { firstName: "", lastName: "", email: "" };
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : { firstName: "", lastName: "", email: "" };
  } catch {
    return { firstName: "", lastName: "", email: "" };
  }
}

export default function NewsletterForm() {
  const [form, setForm] = useState<Draft>(() => loadDraft());
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    localStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    const { firstName, lastName, email } = form;

    // Client-side validation
    if (!firstName.trim()) {
      setStatus("error");
      setErrorMessage("Ingresá tu nombre.");
      return;
    }
    if (!lastName.trim()) {
      setStatus("error");
      setErrorMessage("Ingresá tu apellido.");
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setErrorMessage("Ingresá un email válido.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 201) {
        setStatus("success");
        setForm({ firstName: "", lastName: "", email: "" });
        localStorage.removeItem(DRAFT_KEY);
      } else if (res.status === 409) {
        setStatus("error");
        setErrorMessage("Ese email ya está en la lista. ¡Gracias!");
      } else if (res.status === 503) {
        setStatus("error");
        setErrorMessage("El newsletter está siendo configurado. Probá de nuevo pronto.");
      } else {
        setStatus("error");
        setErrorMessage(data?.error ?? "Algo salió mal. Intentá de nuevo.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("No se pudo conectar. Revisá tu conexión e intentá de nuevo.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center animate-fade-in-up">
        <div className="w-12 h-12 rounded-full bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff751f" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <p className="text-white font-semibold">
          {form.firstName ? `Listo, ${form.firstName}.` : "Listo."} Te avisamos cuando sale un nuevo episodio.
        </p>
        <p className="text-white/40 text-sm">Revisá spam si no te llega en los próximos días.</p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white/5 border border-white/10 focus:border-brand-orange/60 focus:bg-white/8 rounded-xl px-4 py-3 text-white placeholder:text-white/25 text-sm outline-none transition-colors duration-200 disabled:opacity-50";

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-3">
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="newsletter-firstName" className="sr-only">Nombre</label>
          <input
            id="newsletter-firstName"
            type="text"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            placeholder="Nombre"
            autoComplete="given-name"
            disabled={status === "loading"}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="newsletter-lastName" className="sr-only">Apellido</label>
          <input
            id="newsletter-lastName"
            type="text"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            placeholder="Apellido"
            autoComplete="family-name"
            disabled={status === "loading"}
            className={inputClass}
          />
        </div>
      </div>

      {/* Email + submit row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="newsletter-email" className="sr-only">Email</label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          autoComplete="email"
          disabled={status === "loading"}
          aria-describedby={status === "error" ? "newsletter-error" : undefined}
          aria-invalid={status === "error"}
          className={`flex-1 ${inputClass} aria-[invalid=true]:border-red-500/60`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-brand-orange text-white font-semibold px-7 py-3 rounded-xl hover:bg-brand-orange/85 active:scale-95 transition-all duration-150 whitespace-nowrap text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === "loading" ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Enviando…
            </span>
          ) : (
            "Suscribirme"
          )}
        </button>
      </div>

      {status === "error" && (
        <p id="newsletter-error" role="alert" className="text-sm text-red-400">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
