"use client";

import { useState } from "react";
import Link from "next/link";
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

function getEntryForMonth(monthIndex: number): Entry | null {
  const mm = String(monthIndex + 1).padStart(2, "0");
  return entries.find((e) => e.date.startsWith(`${YEAR}-${mm}`)) ?? null;
}

function formatFieldDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatActivity(activity: string): string {
  return activity
    .split(/[-\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("-");
}

export default function PassportPage() {
  const [spreadIndex, setSpreadIndex] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const leftIdx  = spreadIndex * 2;
  const rightIdx = spreadIndex * 2 + 1;

  return (
    <div className="min-h-screen bg-light-gray flex flex-col">

      <nav className="bg-navy px-6 py-3 flex items-center justify-between shrink-0">
        <Link href="/" className="font-body text-sm text-cyan hover:text-white transition-colors">
          ← Cover
        </Link>
        <span className="font-heading font-semibold text-white text-xs tracking-widest uppercase">
          Lunch Passport
        </span>
        <div className="w-16" />
      </nav>

      <div className="flex-1 flex flex-col items-center justify-start py-10 px-4 gap-6">

        {/* Open book */}
        <div
          className="w-full max-w-4xl rounded-sm overflow-hidden"
          style={{ boxShadow: "0 28px 80px rgba(37,47,106,0.22), 0 4px 16px rgba(37,47,106,0.10)" }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_18px_1fr]">

            <PageLeaf
              monthName={MONTHS[leftIdx]}
              monthIndex={leftIdx}
              entry={getEntryForMonth(leftIdx)}
              side="left"
              onStampClick={setSelectedEntry}
            />

            {/* Spine */}
            <div
              className="hidden sm:block"
              style={{
                background: "linear-gradient(to right, #141b46 0%, #252F6A 40%, #252F6A 60%, #141b46 100%)",
                boxShadow: "inset 0 0 20px rgba(0,0,0,0.45)",
              }}
            />

            <PageLeaf
              monthName={MONTHS[rightIdx]}
              monthIndex={rightIdx}
              entry={getEntryForMonth(rightIdx)}
              side="right"
              onStampClick={setSelectedEntry}
            />

          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-10">
          <button
            onClick={() => setSpreadIndex((i) => Math.max(0, i - 1))}
            disabled={spreadIndex === 0}
            className="font-body text-sm font-medium text-dark-gray hover:text-navy disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>

          <div className="text-center">
            <p className="font-heading text-sm font-semibold text-navy">
              {MONTHS[leftIdx]} – {MONTHS[rightIdx]}
            </p>
            <p className="font-body text-dark-gray tracking-widest mt-0.5" style={{ fontSize: "0.65rem" }}>
              {YEAR}
            </p>
          </div>

          <button
            onClick={() => setSpreadIndex((i) => Math.min(TOTAL_SPREADS - 1, i + 1))}
            disabled={spreadIndex === TOTAL_SPREADS - 1}
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

function PageLeaf({ monthName, monthIndex, entry, side, onStampClick }: PageLeafProps) {
  const spineShadow =
    side === "left"
      ? "inset -10px 0 24px rgba(0,0,0,0.09)"
      : "inset 10px 0 24px rgba(0,0,0,0.09)";
  const pageNum = String(monthIndex + 1).padStart(2, "0");

  return (
    <div
      className="paper-texture relative min-h-[560px] sm:min-h-[640px] px-8 sm:px-10 py-8 sm:py-10 flex flex-col"
      style={{ boxShadow: spineShadow }}
    >
      {/* Emoji border — decorative, behind all content */}
      <EmojiBorder emoji={entry?.borderEmoji ?? "🍴"} />

      {/* Month label */}
      <div className="mb-3 relative z-10">
        <div className="inline-block border border-navy/30 px-3 py-1.5" style={{ borderRadius: "1px" }}>
          <p className="font-heading font-bold text-navy uppercase" style={{ fontSize: "0.6rem", letterSpacing: "0.22em" }}>
            {monthName} · {YEAR}
          </p>
        </div>
      </div>

      {/* Separator */}
      <div className="mb-3 relative z-10" style={{ borderTop: "1px solid rgba(37,47,106,0.15)" }} />

      {/* Entry number */}
      <p
        className="font-heading font-bold text-navy uppercase mb-4 relative z-10"
        style={{ fontSize: "0.68rem", letterSpacing: "0.18em" }}
      >
        Entry №&nbsp;{pageNum}
      </p>

      {/* Structured fields */}
      <div className="space-y-2.5 mb-6 relative z-10">
        <Field label="Establishment"  value={entry?.place} />
        <Field label="Date of Visit"  value={entry ? formatFieldDate(entry.date) : undefined} />
        <Field label="Type of Outing" value={entry ? formatActivity(entry.activity) : undefined} />
        <Field label="Party Size"     value={entry ? String(entry.partySize) : undefined} />
        <Field label="Favorite Dish"  value={entry?.favoriteDish} />
      </div>

      {/* Stamp — the hero of the page */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        {entry ? (
          <Stamp entry={entry} monthIndex={monthIndex} onClick={() => onStampClick(entry)} />
        ) : (
          <EmptyStampPlaceholder />
        )}
      </div>

      {/* Page number */}
      <div className="mt-4 flex justify-end relative z-10">
        <span className="font-body text-dark-gray uppercase" style={{ fontSize: "0.56rem", letterSpacing: "0.2em" }}>
          {pageNum}
        </span>
      </div>
    </div>
  );
}

// ─── Field row ────────────────────────────────────────────────────────────────

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      {/* Label — small caps style via uppercase + letterspacing */}
      <span
        className="font-heading text-dark-gray uppercase shrink-0"
        style={{ fontSize: "0.58rem", letterSpacing: "0.1em" }}
      >
        {label}
      </span>

      {/* Dotted leader — stretches to fill remaining space */}
      <span
        className="flex-1"
        style={{
          borderBottom: "1px dotted rgba(51,65,85,0.3)",
          minWidth: "12px",
          marginBottom: "2px",
        }}
      />

      {/* Value — body text, right-aligned, wraps naturally if long */}
      <span
        className="font-body text-dark-gray text-right leading-tight"
        style={{ fontSize: "0.7rem", maxWidth: "58%" }}
      >
        {value ?? ""}
      </span>
    </div>
  );
}

// ─── Emoji border ─────────────────────────────────────────────────────────────

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

function EmojiBorder({ emoji }: { emoji: string }) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
      {SPRINKLE_POSITIONS.map((pos, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            fontSize: "14px",
            opacity: 0.22,
            lineHeight: 1,
            transform: `rotate(${pos.rotate}deg)`,
            top:    pos.top,
            bottom: pos.bottom,
            left:   pos.left,
            right:  pos.right,
          }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

// ─── Empty stamp placeholder ──────────────────────────────────────────────────

function EmptyStampPlaceholder() {
  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{
        width: "210px",
        height: "210px",
        border: "1.5px dashed rgba(51,65,85,0.18)",
      }}
    >
      <p className="font-body text-dark-gray italic text-center leading-relaxed" style={{ fontSize: "0.72rem", maxWidth: "130px" }}>
        We didn&rsquo;t gather here this month.
      </p>
    </div>
  );
}
