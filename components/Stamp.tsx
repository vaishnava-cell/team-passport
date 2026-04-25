import { Entry } from "@/types/entry";

type Props = {
  entry: Entry;
  monthIndex: number;
  onClick: () => void;
};

const STAMP_COLORS = [
  { hex: "#FFC629" }, // sunshine
  { hex: "#00BFA5" }, // teal
  { hex: "#8B7EC8" }, // lavender
  { hex: "#FF9A76" }, // peach
  { hex: "#8EDCB4" }, // mint
  { hex: "#EF4A2E" }, // coral
];

const ROTATIONS = [-6, 3, -8, 5, -3, 7, -5, 4, -7, 2, -4, 6];

const ACTIVITY_ICONS: Record<string, string> = {
  "mini-golf": "⛳",
  golf:        "⛳",
  lunch:       "🍽️",
  dinner:      "🍷",
  coffee:      "☕",
  bowling:     "🎳",
  hiking:      "🥾",
  hike:        "🥾",
  movie:       "🎬",
  picnic:      "🧺",
  escape:      "🔐",
  karaoke:     "🎤",
  art:         "🎨",
  cook:        "👨‍🍳",
};

function getIcon(activity: string): string {
  const lower = activity.toLowerCase();
  return (
    Object.entries(ACTIVITY_ICONS).find(([key]) => lower.includes(key))?.[1] ??
    "📍"
  );
}

function formatStampDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

export default function Stamp({ entry, monthIndex, onClick }: Props) {
  const color    = STAMP_COLORS[monthIndex % STAMP_COLORS.length];
  const rotation = ROTATIONS[monthIndex % ROTATIONS.length];
  const icon     = getIcon(entry.activity);

  return (
    <button
      onClick={onClick}
      aria-label={`View details for ${entry.place}`}
      className="cursor-pointer transition-opacity hover:opacity-100 focus:outline-none"
      style={{ transform: `rotate(${rotation}deg)`, opacity: 0.87 }}
    >
      {/* Outer border — slightly uneven radius for inked feel */}
      <div
        className="w-64 px-5 py-4"
        style={{
          border: `3px solid ${color.hex}`,
          borderRadius: "3px 4px 3px 4px",
          backgroundColor: `color-mix(in srgb, ${color.hex} 7%, white)`,
        }}
      >
        {/* Inner border */}
        <div
          className="px-3 py-3"
          style={{ border: `1px solid ${color.hex}`, borderRadius: "1px" }}
        >
          <div className="text-center text-xl mb-1 leading-none">{icon}</div>

          <p
            className="font-heading font-bold text-center uppercase leading-tight mb-2"
            style={{ color: color.hex, fontSize: "0.6rem", letterSpacing: "0.12em" }}
          >
            {entry.place}
          </p>

          <div className="h-px mb-2" style={{ backgroundColor: color.hex, opacity: 0.35 }} />

          <div className="text-center" style={{ color: color.hex }}>
            <p className="font-body font-semibold" style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}>
              {formatStampDate(entry.date)}
            </p>
            <p className="font-body uppercase opacity-70" style={{ fontSize: "0.58rem", letterSpacing: "0.1em" }}>
              {entry.activity}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}
