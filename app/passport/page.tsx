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
const TOTAL_SPREADS = 6; // Jan–Feb, Mar–Apr, … Nov–Dec

function getEntryForMonth(monthIndex: number): Entry | null {
  const mm = String(monthIndex + 1).padStart(2, "0");
  return entries.find((e) => e.date.startsWith(`${YEAR}-${mm}`)) ?? null;
}

export default function PassportPage() {
  // Start on March–April (spread 1) — where the sample data lives
  const [spreadIndex, setSpreadIndex] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const leftIdx  = spreadIndex * 2;
  const rightIdx = spreadIndex * 2 + 1;

  return (
    <div className="min-h-screen bg-light-gray flex flex-col">

      {/* Top nav */}
      <nav className="bg-navy px-6 py-4 flex items-center justify-between shrink-0">
        <Link
          href="/"
          className="font-body text-sm text-white/50 hover:text-white transition-colors"
        >
          ← Cover
        </Link>
        <span className="font-heading font-semibold text-white text-sm tracking-widest uppercase">
          Team Passport
        </span>
        <div className="w-16" />
      </nav>

      {/* Spread navigation bar */}
      <div className="bg-white border-b border-med-gray/20 px-6 py-4 flex items-center justify-between shrink-0">
        <button
          onClick={() => setSpreadIndex((i) => Math.max(0, i - 1))}
          disabled={spreadIndex === 0}
          className="font-body text-sm font-medium text-navy hover:text-cyan transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        >
          ← Prev
        </button>

        <div className="text-center">
          <p className="font-heading text-base font-semibold text-navy">
            {MONTHS[leftIdx]} – {MONTHS[rightIdx]}
          </p>
          <p className="font-body text-xs text-med-gray tracking-widest mt-0.5">
            {YEAR}
          </p>
        </div>

        <button
          onClick={() => setSpreadIndex((i) => Math.min(TOTAL_SPREADS - 1, i + 1))}
          disabled={spreadIndex === TOTAL_SPREADS - 1}
          className="font-body text-sm font-medium text-navy hover:text-cyan transition-colors disabled:opacity-25 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>

      {/* Two-page spread */}
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-med-gray/20">
        <MonthPage
          monthName={MONTHS[leftIdx]}
          monthIndex={leftIdx}
          entry={getEntryForMonth(leftIdx)}
          onStampClick={setSelectedEntry}
        />
        <MonthPage
          monthName={MONTHS[rightIdx]}
          monthIndex={rightIdx}
          entry={getEntryForMonth(rightIdx)}
          onStampClick={setSelectedEntry}
        />
      </div>

      <EntryModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
  );
}

type MonthPageProps = {
  monthName: string;
  monthIndex: number;
  entry: Entry | null;
  onStampClick: (entry: Entry) => void;
};

function MonthPage({ monthName, monthIndex, entry, onStampClick }: MonthPageProps) {
  return (
    <div className="bg-white px-8 py-10 sm:px-12 sm:py-14 flex flex-col min-h-80">

      {/* Month label */}
      <div className="mb-10">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-med-gray/60 mb-0.5">
          {YEAR}
        </p>
        <h2 className="font-heading text-2xl font-semibold text-navy">
          {monthName}
        </h2>
      </div>

      {/* Stamp or empty slot */}
      <div className="flex-1 flex items-center justify-center">
        {entry ? (
          <Stamp entry={entry} monthIndex={monthIndex} onClick={() => onStampClick(entry)} />
        ) : (
          <EmptySlot />
        )}
      </div>

      {/* Page number */}
      <div className="mt-10 text-right">
        <span className="font-body text-med-gray/35" style={{ fontSize: "0.65rem", letterSpacing: "0.15em" }}>
          {String(monthIndex + 1).padStart(2, "0")} / 12
        </span>
      </div>

    </div>
  );
}

function EmptySlot() {
  return (
    <div className="w-64 h-40 border-2 border-dashed border-med-gray/25 flex items-center justify-center" style={{ borderRadius: "3px" }}>
      <p className="font-body text-sm text-med-gray/40 italic text-center px-6 leading-relaxed">
        We didn't gather here this month.
      </p>
    </div>
  );
}
