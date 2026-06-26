const ITEMS = [
  { text: "SWAP", accent: true },
  { text: "SALUD & DEPORTE", accent: false },
  { text: "CARRERA", accent: false },
  { text: "EMPRENDIMIENTO", accent: false },
  { text: "INTELIGENCIA ARTIFICIAL", accent: false },
  { text: "MINDSET", accent: false },
  { text: "PRODUCTIVIDAD", accent: false },
  { text: "DESARROLLO PERSONAL", accent: false },
  { text: "ARGENTINA & LATAM", accent: true },
];

function Dot() {
  return (
    <span aria-hidden className="mx-6 w-1 h-1 rounded-full bg-brand-orange/60 shrink-0 inline-block" />
  );
}

function Track() {
  return (
    <div className="flex items-center shrink-0">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span
            className={`text-xs font-mono uppercase tracking-[0.2em] whitespace-nowrap ${
              item.accent ? "text-brand-orange" : "text-white/25"
            }`}
          >
            {item.text}
          </span>
          <Dot />
        </span>
      ))}
    </div>
  );
}

export default function MarqueeStrip() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full overflow-hidden border-y border-white/[0.06] py-4 bg-black"
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-black to-transparent" />

      {/* Two copies side-by-side so the loop is seamless */}
      <div
        className="flex"
        style={{ animation: "marquee 28s linear infinite" }}
      >
        <Track />
        <Track />
      </div>
    </div>
  );
}
