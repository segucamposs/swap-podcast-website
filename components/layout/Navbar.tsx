"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/episodes", label: "Episodios" },
  { href: "/about", label: "Nosotros" },
  { href: "/contact", label: "Contacto" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/5">
      <nav
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link href="/" aria-label="SWAP Podcast — Inicio">
          <Image
            src="/logo/swap-logo-transparent.png"
            alt="SWAP Podcast"
            width={88}
            height={36}
            priority
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8" role="list">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="listitem"
              className={`text-sm font-medium transition-colors duration-200 hover:text-brand-orange ${
                isActive(link.href) ? "text-brand-orange" : "text-white/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.5 p-2 -mr-2 rounded focus-visible:ring-2 focus-visible:ring-brand-orange"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 origin-center ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-0.5 bg-white transition-transform duration-300 origin-center ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 border-t border-white/10" : "max-h-0"
        }`}
        aria-hidden={!isOpen}
      >
        <nav className="bg-black px-4 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`px-2 py-3 text-base font-medium rounded transition-colors duration-200 hover:text-brand-orange ${
                isActive(link.href) ? "text-brand-orange" : "text-white/60"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
