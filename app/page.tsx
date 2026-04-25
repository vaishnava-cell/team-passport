import Link from "next/link";

export default function CoverPage() {
  return (
    <main className="min-h-screen bg-light-gray flex flex-col items-center justify-center py-16 px-4 gap-8">

      {/* The passport — a clickable physical object */}
      <Link href="/passport" className="group block">
        <div
          className="relative bg-navy transition-shadow duration-300"
          style={{
            width: "clamp(260px, 70vw, 340px)",
            aspectRatio: "3 / 4",
            boxShadow: "0 20px 60px rgba(37,47,106,0.35), 0 4px 12px rgba(37,47,106,0.2)",
          }}
        >
          {/* Outer inner frame */}
          <div className="absolute inset-3 border border-cyan/30 pointer-events-none" />
          {/* Inner inner frame */}
          <div className="absolute inset-[18px] border border-cyan/15 pointer-events-none" />

          {/* Cover content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8">

            {/* Issuer label */}
            <p
              className="font-body text-cyan uppercase tracking-[0.4em]"
              style={{ fontSize: "0.55rem" }}
            >
              Collabo XD
            </p>

            {/* Logo / crest */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/collaboxd-logo.svg"
              alt="Collabo XD"
              style={{ width: "clamp(80px, 22vw, 110px)", height: "auto" }}
            />

            {/* Title */}
            <div className="text-center mt-1">
              <p
                className="font-heading font-bold text-white uppercase leading-none tracking-[0.2em]"
                style={{ fontSize: "clamp(1rem, 3.5vw, 1.25rem)" }}
              >
                Lunch
              </p>
              <p
                className="font-heading font-bold text-white uppercase leading-none tracking-[0.2em]"
                style={{ fontSize: "clamp(1rem, 3.5vw, 1.25rem)" }}
              >
                Passport
              </p>
            </div>

            {/* Year */}
            <p
              className="font-heading text-white/70 font-light tracking-[0.55em]"
              style={{ fontSize: "0.65rem" }}
            >
              2026
            </p>

          </div>
        </div>
      </Link>

      {/* CTA below the cover */}
      <Link
        href="/passport"
        className="font-body font-semibold bg-coral text-white px-8 py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
      >
        Open Passport →
      </Link>

    </main>
  );
}
