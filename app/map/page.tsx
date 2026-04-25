import Link from "next/link";
import entriesData from "@/data/entries.json";
import { Entry } from "@/types/entry";

const entries = entriesData as Entry[];

// Stamp border colors by name (border color = the bright version shown on the dot)
const STAMP_COLOR_MAP: Record<string, string> = {
  sunshine: "#FFC629",
  teal:     "#00BFA5",
  lavender: "#8B7EC8",
  peach:    "#FF9A76",
  mint:     "#8EDCB4",
  coral:    "#EF4A2E",
  cyan:     "#00ADEF",
};
const FALLBACK_COLORS = ["#FFC629","#00BFA5","#8B7EC8","#FF9A76","#8EDCB4","#EF4A2E"];

function getStampColor(entry: Entry, monthIndex: number): string {
  if (entry.stampColor && STAMP_COLOR_MAP[entry.stampColor]) {
    return STAMP_COLOR_MAP[entry.stampColor];
  }
  return FALLBACK_COLORS[monthIndex % FALLBACK_COLORS.length];
}

function formatMonthYear(dateStr: string): string {
  const [year, month] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "long", year: "numeric",
  });
}

export default function MapPage() {
  // Enrich each entry with its month index (0–11) for routing and color lookup
  const enriched = entries.map((entry) => {
    const monthIndex = parseInt(entry.date.split("-")[1], 10) - 1;
    return { entry, monthIndex };
  });

  return (
    <div className="min-h-screen bg-light-gray flex flex-col">

      {/* Nav — matches passport nav styling, left link goes back to passport */}
      <nav className="bg-navy px-6 py-3 flex items-center justify-between shrink-0">
        <Link
          href="/passport"
          className="font-body text-sm text-cyan hover:text-white transition-colors"
        >
          ← Passport
        </Link>
        <span className="font-heading font-semibold text-white text-xs tracking-widest uppercase">
          Lunch Passport
        </span>
        <div className="w-16" />
      </nav>

      {/* Page content */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-10 space-y-14">

        {/* ── Section A: Map ── */}
        <section>
          <h2 className="font-heading font-bold text-navy text-3xl mb-1">
            Where We&rsquo;ve Been
          </h2>
          <p className="font-body text-dark-gray text-sm mb-6">
            Every outing, mapped.
          </p>

          {/* Responsive iframe wrapper — 16:9 aspect ratio, max 1000px wide */}
          <div
            className="w-full rounded-lg overflow-hidden border border-navy/15 shadow-md"
            style={{ maxWidth: "1000px", aspectRatio: "16 / 9" }}
          >
            <iframe
              src="https://www.google.com/maps/d/u/0/embed?mid=1wAuU_oRxxhyTnPxO8v5EBrLsSazHhs8&ehbc=2E312F&noprof=1"
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              title="Map of our team outings"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* ── Section B: Entry cards ── */}
        <section>
          <h3 className="font-heading font-semibold text-navy text-xl mb-6">
            The full list
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {enriched.map(({ entry, monthIndex }) => (
              <Link
                key={entry.id}
                href={`/passport?month=${monthIndex}`}
                className="group block bg-white rounded-lg p-5 border border-dark-gray/10 hover:border-navy/25 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200"
              >
                {/* Stamp color indicator + month/year */}
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: getStampColor(entry, monthIndex) }}
                  />
                  <span
                    className="font-body text-dark-gray uppercase"
                    style={{ fontSize: "0.65rem", letterSpacing: "0.1em" }}
                  >
                    {formatMonthYear(entry.date)}
                  </span>
                </div>

                {/* Place name */}
                <h4 className="font-heading font-semibold text-navy text-lg leading-tight mb-1 group-hover:text-cyan transition-colors">
                  {entry.place}
                </h4>

                {/* Activity */}
                <p className="font-body text-dark-gray text-sm">
                  {entry.activity}
                </p>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
