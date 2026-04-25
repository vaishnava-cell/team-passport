import Link from "next/link";

export default function CoverPage() {
  return (
    <main className="min-h-screen bg-navy flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">

      {/* Top accent — cyan double rule, like a passport header band */}
      <div className="absolute top-0 left-0 right-0">
        <div className="h-1 bg-cyan" />
        <div className="h-px bg-cyan/20 mt-1.5" />
      </div>

      {/* Issuing label */}
      <p className="font-body text-xs tracking-[0.4em] uppercase text-med-gray mb-14">
        Collabo XD
      </p>

      {/* Main title — TEAM white, PASSPORT cyan */}
      <div className="mb-8">
        <h1
          className="font-heading font-bold text-white leading-none"
          style={{ fontSize: "clamp(3.5rem, 13vw, 8rem)" }}
        >
          TEAM
        </h1>
        <h1
          className="font-heading font-bold text-cyan leading-none"
          style={{ fontSize: "clamp(3.5rem, 13vw, 8rem)" }}
        >
          PASSPORT
        </h1>
      </div>

      {/* Year */}
      <p className="font-heading text-white/35 text-lg tracking-[0.6em] font-light mb-5">
        2026
      </p>

      {/* Tagline */}
      <p className="font-body text-white/45 text-sm mb-14 max-w-xs leading-relaxed">
        Every outing, every memory — documented for keeps.
      </p>

      {/* CTA */}
      <Link
        href="/passport"
        className="font-body font-semibold bg-coral text-white px-10 py-4 rounded-full text-base hover:opacity-90 transition-opacity"
      >
        Open Passport →
      </Link>

      {/* Bottom accent — coral, complements the cyan top */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-px bg-coral/20 mb-1.5" />
        <div className="h-1 bg-coral" />
      </div>

    </main>
  );
}
