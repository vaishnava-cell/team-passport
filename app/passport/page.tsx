"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, useAnimation } from "framer-motion";
import entriesData from "@/data/entries.json";
import { Entry } from "@/types/entry";
import Stamp from "@/components/Stamp";
import EntryModal from "@/components/EntryModal";

const entries = entriesData as Entry[];

const YEAR = 2026;
const MONTHS = [
  "January", "February", "March",    "April",
  "May",      "June",     "July",     "August",
  "September","October",  "November", "December",
];
const TOTAL_SPREADS = 6;
const COVER = -1; // sentinel for the cover state

function getEntryForMonth(monthIndex: number): Entry | null {
  const mm = String(monthIndex + 1).padStart(2, "0");
  return entries.find((e) => e.date.startsWith(`${YEAR}-${mm}`)) ?? null;
}

function formatFieldDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric",
  });
}

function formatActivity(activity: string): string {
  return activity
    .split(/[-\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

export default function PassportPage() {
  // spreadIndex: -1 = cover, 0–5 = the six spreads (Jan–Dec)
  // Start at 1 (Mar–Apr, where data lives) so "/passport" goes straight to content.
  // The cover is accessible via Prev from spread 0, or the "← Cover" quick-jump.
  const [spreadIndex, setSpreadIndex]     = useState(COVER);
  const [isAnimating, setIsAnimating]     = useState(false);
  const [isMobile, setIsMobile]           = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const leftControls  = useAnimation();
  const rightControls = useAnimation();
  const coverControls = useAnimation(); // fades the cover in/out

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Jump to cover instantly (used by the header logo click) ─────────────────
  const jumpToCover = useCallback(() => {
    setIsAnimating(false);
    setSelectedEntry(null);
    setSpreadIndex(COVER);
    coverControls.set({ opacity: 1 });
    leftControls.set({ rotateY: 0, opacity: 1 });
    rightControls.set({ rotateY: 0, opacity: 1 });
  }, [coverControls, leftControls, rightControls]);

  // ── Read ?month=N query param and jump to the right spread on mount ──────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const monthParam = params.get("month");
    if (monthParam !== null) {
      const m = parseInt(monthParam, 10);
      if (!isNaN(m) && m >= 0 && m <= 11) {
        setSpreadIndex(Math.floor(m / 2));
      }
    }
  }, []); // runs once on mount

  // ── Next ────────────────────────────────────────────────────────────────────
  const goNext = useCallback(async () => {
    if (isAnimating || spreadIndex >= TOTAL_SPREADS - 1) return;
    setIsAnimating(true);
    setSelectedEntry(null);

    if (spreadIndex === COVER) {
      // Cover → spread 0: cover fades out, spread fades in
      await coverControls.start({ opacity: 0, transition: { duration: 0.25, ease: "easeOut" } });
      setSpreadIndex(0);
      leftControls.set({ opacity: 0, rotateY: 0 });
      rightControls.set({ opacity: 0, rotateY: 0 });
      coverControls.set({ opacity: 1 }); // reset for next visit
      await Promise.all([
        leftControls.start({ opacity: 1, transition: { duration: 0.25 } }),
        rightControls.start({ opacity: 1, transition: { duration: 0.25 } }),
      ]);
    } else if (isMobile) {
      await Promise.all([
        leftControls.start({ opacity: 0, transition: { duration: 0.18 } }),
        rightControls.start({ opacity: 0, transition: { duration: 0.18 } }),
      ]);
      setSpreadIndex((i) => i + 1);
      leftControls.set({ opacity: 0 });
      rightControls.set({ opacity: 0 });
      await Promise.all([
        leftControls.start({ opacity: 1, transition: { duration: 0.18 } }),
        rightControls.start({ opacity: 1, transition: { duration: 0.18 } }),
      ]);
    } else {
      // Right page lifts (hinges on its left/spine edge)
      await rightControls.start({
        rotateY: -90, opacity: 0,
        transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
      });
      setSpreadIndex((i) => i + 1);
      rightControls.set({ rotateY: 7, opacity: 0 });
      await rightControls.start({
        rotateY: 0, opacity: 1,
        transition: { duration: 0.18, ease: [0, 0, 0.2, 1] },
      });
    }

    setIsAnimating(false);
  }, [isAnimating, isMobile, spreadIndex, coverControls, leftControls, rightControls]);

  // ── Prev ────────────────────────────────────────────────────────────────────
  const goPrev = useCallback(async () => {
    if (isAnimating || spreadIndex === COVER) return;
    setIsAnimating(true);
    setSelectedEntry(null);

    if (spreadIndex === 0) {
      // Spread 0 → cover: left page lifts (or fades on mobile), cover fades in
      if (isMobile) {
        await Promise.all([
          leftControls.start({ opacity: 0, transition: { duration: 0.18 } }),
          rightControls.start({ opacity: 0, transition: { duration: 0.18 } }),
        ]);
      } else {
        // Left page lifts (hinges on its right/spine edge)
        await leftControls.start({
          rotateY: 90, opacity: 0,
          transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
        });
      }
      coverControls.set({ opacity: 0 });
      setSpreadIndex(COVER);
      await coverControls.start({ opacity: 1, transition: { duration: 0.25 } });
      // Reset page controls ready for next time the spread is shown
      leftControls.set({ rotateY: 0, opacity: 1 });
      rightControls.set({ rotateY: 0, opacity: 1 });
    } else if (isMobile) {
      await Promise.all([
        leftControls.start({ opacity: 0, transition: { duration: 0.18 } }),
        rightControls.start({ opacity: 0, transition: { duration: 0.18 } }),
      ]);
      setSpreadIndex((i) => i - 1);
      leftControls.set({ opacity: 0 });
      rightControls.set({ opacity: 0 });
      await Promise.all([
        leftControls.start({ opacity: 1, transition: { duration: 0.18 } }),
        rightControls.start({ opacity: 1, transition: { duration: 0.18 } }),
      ]);
    } else {
      // Left page lifts (hinges on its right/spine edge)
      await leftControls.start({
        rotateY: 90, opacity: 0,
        transition: { duration: 0.3, ease: [0, 0, 0.2, 1] },
      });
      setSpreadIndex((i) => i - 1);
      leftControls.set({ rotateY: -7, opacity: 0 });
      await leftControls.start({
        rotateY: 0, opacity: 1,
        transition: { duration: 0.18, ease: [0, 0, 0.2, 1] },
      });
    }

    setIsAnimating(false);
  }, [isAnimating, isMobile, spreadIndex, coverControls, leftControls, rightControls]);

  const isOnCover   = spreadIndex === COVER;
  const prevDisabled = isOnCover || isAnimating;
  const nextDisabled = spreadIndex === TOTAL_SPREADS - 1 || isAnimating;

  const leftIdx  = isOnCover ? 0 : spreadIndex * 2;
  const rightIdx = isOnCover ? 1 : spreadIndex * 2 + 1;

  return (
    <div className="min-h-screen bg-light-gray flex flex-col">

      {/* Nav — 3-col grid so center group is always truly centered */}
      <nav className="bg-navy px-6 py-3 grid grid-cols-3 items-center shrink-0">
        {/* Left: coral "Map" button */}
        <div>
          <Link
            href="/map"
            className="font-body font-semibold bg-coral text-white px-4 py-1.5 rounded-full text-xs hover:opacity-90 transition-opacity inline-block"
          >
            Map
          </Link>
        </div>

        {/* Center: logo + title, clickable → jumps to cover */}
        <div className="flex justify-center">
          <button
            onClick={jumpToCover}
            className="flex items-center gap-2 hover:opacity-75 transition-opacity cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/collaboxd-logo.svg"
              alt="Collabo XD"
              style={{ height: "26px", width: "auto" }}
            />
            <span className="font-heading font-semibold text-white text-xs tracking-widest uppercase">
              Lunch Passport
            </span>
          </button>
        </div>

        {/* Right: empty — grid handles centering */}
        <div />
      </nav>

      <div className="flex-1 flex flex-col items-center justify-start py-10 px-4 gap-6">

        {/* ── Cover ── */}
        {isOnCover && (
          <motion.div
            animate={coverControls}
            initial={{ opacity: 1 }}
            className="flex flex-col items-center gap-8"
          >
            {/*
              The cover card is clickable. The "Open Passport" button is OUTSIDE
              this div to avoid click-event double-firing via propagation.
            */}
            <div
              onClick={goNext}
              className="relative bg-navy cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
              style={{
                width: "clamp(240px, 40vw, 384px)",
                aspectRatio: "3 / 4",
                boxShadow: "0 20px 60px rgba(37,47,106,0.35), 0 4px 12px rgba(37,47,106,0.2)",
              }}
            >
              <div className="absolute inset-3 border border-cyan/30 pointer-events-none" />
              <div className="absolute inset-[18px] border border-cyan/15 pointer-events-none" />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8">
                <p className="font-body text-cyan uppercase tracking-[0.4em]" style={{ fontSize: "0.55rem" }}>
                  Collabo XD
                </p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/collaboxd-logo.svg"
                  alt="Collabo XD"
                  style={{ width: "clamp(64px, 17vw, 88px)", height: "auto" }}
                />
                <div className="text-center mt-1">
                  <p className="font-heading font-bold text-white uppercase leading-none tracking-[0.2em]" style={{ fontSize: "clamp(1rem, 3.5vw, 1.25rem)" }}>
                    Lunch
                  </p>
                  <p className="font-heading font-bold text-white uppercase leading-none tracking-[0.2em]" style={{ fontSize: "clamp(1rem, 3.5vw, 1.25rem)" }}>
                    Passport
                  </p>
                </div>

              </div>
            </div>

            {/* Button is outside the cover div — no propagation conflict */}
            <button
              onClick={goNext}
              className="font-body font-semibold border-2 border-coral text-coral bg-transparent px-8 py-3 rounded-full text-sm hover:bg-coral/8 transition-colors"
            >
              Open Passport →
            </button>
          </motion.div>
        )}

        {/* ── Book spread ── */}
        {!isOnCover && (
          <div
            className="w-full max-w-[720px] rounded-sm overflow-hidden"
            style={{
              boxShadow: "0 28px 80px rgba(37,47,106,0.22), 0 4px 16px rgba(37,47,106,0.10)",
              perspective: "1500px",
            }}
          >
            <div
              className="grid grid-cols-1 sm:grid-cols-[1fr_18px_1fr]"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                initial={{ rotateY: 0, opacity: 1 }}
                animate={leftControls}
                style={{ transformOrigin: "right center", backfaceVisibility: "hidden", willChange: "transform, opacity" }}
              >
                <PageLeaf
                  monthName={MONTHS[leftIdx]}
                  monthIndex={leftIdx}
                  entry={getEntryForMonth(leftIdx)}
                  side="left"
                  onStampClick={setSelectedEntry}
                />
              </motion.div>

              <div
                className="hidden sm:block"
                style={{
                  background: "linear-gradient(to right, #141b46 0%, #252F6A 40%, #252F6A 60%, #141b46 100%)",
                  boxShadow: "inset 0 0 20px rgba(0,0,0,0.45)",
                }}
              />

              <motion.div
                initial={{ rotateY: 0, opacity: 1 }}
                animate={rightControls}
                style={{ transformOrigin: "left center", backfaceVisibility: "hidden", willChange: "transform, opacity" }}
              >
                <PageLeaf
                  monthName={MONTHS[rightIdx]}
                  monthIndex={rightIdx}
                  entry={getEntryForMonth(rightIdx)}
                  side="right"
                  onStampClick={setSelectedEntry}
                />
              </motion.div>
            </div>
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex items-center gap-10">
          <button
            onClick={goPrev}
            disabled={prevDisabled}
            className="font-body text-sm font-medium text-dark-gray hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>

          <div className="text-center">
            {isOnCover ? (
              <p className="font-heading text-sm font-semibold text-navy">Cover</p>
            ) : (
              <p className="font-heading text-sm font-semibold text-navy">
                {MONTHS[leftIdx]} – {MONTHS[rightIdx]}
              </p>
            )}
            <p className="font-body text-dark-gray tracking-widest mt-0.5" style={{ fontSize: "0.65rem" }}>
              {YEAR}
            </p>
          </div>

          <button
            onClick={goNext}
            disabled={nextDisabled}
            className="font-body text-sm font-medium text-dark-gray hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>

      </div>

      <EntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
  );
}

// ─── Page leaf ────────────────────────────────────────────────────────────────

type PageLeafProps = {
  monthName: string;
  monthIndex: number;
  entry: Entry | null;
  side: "left" | "right";
  onStampClick: (entry: Entry) => void;
};

const SPRINKLE_POSITIONS = [
  { top:  7,    left:  7,    rotate: -15 },
  { top:  7,    left: "38%", rotate:   5 },
  { top:  7,    right:  7,   rotate:  12 },
  { top: "26%", left:  5,    rotate:  -8 },
  { top: "52%", right:  5,   rotate:  20 },
  { top: "74%", left:  5,    rotate:  -5 },
  { bottom: 7,  left:  7,    rotate:  18 },
  { bottom: 7,  left: "44%", rotate: -10 },
  { bottom: 7,  right:  7,   rotate:   8 },
];

function EmojiBorder({ emoji }: { emoji: string | string[] }) {
  // If emoji is an array, alternate through it by position index
  const pick = (i: number) => Array.isArray(emoji) ? emoji[i % emoji.length] : emoji;

  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
      {SPRINKLE_POSITIONS.map((pos, i) => (
        <span key={i} className="absolute" style={{
          fontSize: "14px", opacity: 0.22, lineHeight: 1,
          transform: `rotate(${pos.rotate}deg)`,
          top: pos.top, bottom: pos.bottom, left: pos.left, right: pos.right,
        }}>
          {pick(i)}
        </span>
      ))}
    </div>
  );
}

function PageLeaf({ monthName, monthIndex, entry, side, onStampClick }: PageLeafProps) {
  const spineShadow =
    side === "left"
      ? "inset -10px 0 24px rgba(0,0,0,0.09)"
      : "inset 10px 0 24px rgba(0,0,0,0.09)";
  const pageNum = String(monthIndex + 1).padStart(2, "0");

  return (
    <div
      className="paper-texture relative min-h-[420px] sm:min-h-[500px] px-8 sm:px-10 py-7 sm:py-8 flex flex-col"
      style={{ boxShadow: spineShadow }}
    >
      <EmojiBorder emoji={entry?.borderEmoji ?? "🍴"} />

      <div className="mb-3 relative z-10">
        <div className="inline-block border border-navy/30 px-3 py-1.5" style={{ borderRadius: "1px" }}>
          <p className="font-heading font-bold text-navy uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.22em" }}>
            {monthName} · {YEAR}
          </p>
        </div>
      </div>

      <div className="mb-3 relative z-10" style={{ borderTop: "1px solid rgba(37,47,106,0.15)" }} />

      <p className="font-heading font-bold text-navy uppercase mb-4 relative z-10" style={{ fontSize: "0.68rem", letterSpacing: "0.18em" }}>
        Entry №&nbsp;{pageNum}
      </p>

      <div className="space-y-2.5 mb-6 relative z-10">
        <Field label="Establishment"  value={entry?.place} />
        <Field label="Date of Visit"  value={entry ? formatFieldDate(entry.date) : undefined} />
        <Field label="Type of Outing" value={entry ? formatActivity(entry.activity) : undefined} />
        <Field label="Party Size"     value={entry ? String(entry.partySize) : undefined} />
        <Field label="Favorite Dish"  value={entry?.favoriteDish} />
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        {entry ? (
          <Stamp entry={entry} monthIndex={monthIndex} onClick={() => onStampClick(entry)} />
        ) : (
          <EmptyStampPlaceholder />
        )}
      </div>

      <div className="mt-4 flex justify-end relative z-10">
        <span className="font-body text-dark-gray uppercase" style={{ fontSize: "0.56rem", letterSpacing: "0.2em" }}>
          {pageNum}
        </span>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-heading text-dark-gray uppercase shrink-0" style={{ fontSize: "0.58rem", letterSpacing: "0.1em" }}>
        {label}
      </span>
      <span className="flex-1" style={{ borderBottom: "1px dotted rgba(51,65,85,0.3)", minWidth: "12px", marginBottom: "2px" }} />
      <span className="font-body text-dark-gray text-right leading-tight" style={{ fontSize: "0.7rem", maxWidth: "58%" }}>
        {value ?? ""}
      </span>
    </div>
  );
}

function EmptyStampPlaceholder() {
  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{ width: "210px", height: "210px", border: "1.5px dashed rgba(51,65,85,0.18)" }}
    >
      <p className="font-body text-dark-gray italic text-center leading-relaxed" style={{ fontSize: "0.72rem", maxWidth: "130px" }}>
        We didn&rsquo;t gather here this month.
      </p>
    </div>
  );
}
