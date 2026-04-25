import { Entry } from "@/types/entry";

type Props = {
  entry: Entry;
  monthIndex: number;
  onClick: () => void;
};

// Border = bright brand color for the rings/decoration
// Text  = AA-compliant dark shade of same hue (≥4.5:1 on cream #FAF8F3)
const STAMP_COLORS = [
  { border: "#FFC629", text: "#6B4C00" }, // sunshine / dark amber
  { border: "#00BFA5", text: "#005C50" }, // teal / dark teal
  { border: "#8B7EC8", text: "#3D2E8C" }, // lavender / dark purple
  { border: "#FF9A76", text: "#7A2800" }, // peach / dark burnt orange
  { border: "#8EDCB4", text: "#1A5C3A" }, // mint / dark green
  { border: "#EF4A2E", text: "#7A1500" }, // coral / dark red
];

const ROTATIONS = [-9, 4, -7, 6, -10, 5, -4, 8, -6, 3, -8, 7];

const ACTIVITY_ICONS: Record<string, string> = {
  "mini-golf": "⛳", golf: "⛳",
  lunch: "🍽️", dinner: "🍷", coffee: "☕",
  bowling: "🎳", hiking: "🥾", hike: "🥾",
  movie: "🎬", picnic: "🧺", escape: "🔐",
  karaoke: "🎤", art: "🎨", cook: "👨‍🍳",
};

function getIcon(activity: string): string {
  const lower = activity.toLowerCase();
  return (
    Object.entries(ACTIVITY_ICONS).find(([key]) => lower.includes(key))?.[1] ?? "📍"
  );
}

export default function Stamp({ entry, monthIndex, onClick }: Props) {
  const color    = STAMP_COLORS[monthIndex % STAMP_COLORS.length];
  const rotation = ROTATIONS[monthIndex % ROTATIONS.length];
  const icon     = getIcon(entry.activity);
  const uid      = `s${monthIndex}`;

  const [year, month, day] = entry.date.split("-").map(Number);
  const dateObj   = new Date(year, month - 1, day);
  const dayNum    = String(day);
  const monthAbbr = dateObj
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();

  // Trim to fit the top arc (~273px half-circumference at r=87, ~11px/char)
  const placeName = entry.place.toUpperCase().slice(0, 22);

  return (
    <button
      onClick={onClick}
      aria-label={`View details for ${entry.place}`}
      className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded-full"
      style={{
        transform: `rotate(${rotation}deg)`,
        mixBlendMode: "multiply",
        opacity: 0.89,
        background: "none",
        padding: 0,
        display: "block",
      }}
    >
      <svg
        width="210"
        height="210"
        viewBox="0 0 210 210"
        style={{ display: "block", overflow: "visible" }}
      >
        <defs>
          {/* Ink imperfection — displaces each pixel slightly based on noise,
              giving edges the uneven look of ink that didn't fully transfer.
              seed varies per stamp so no two have the same imperfection. */}
          <filter id={`ink-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="4"
              seed={monthIndex + 1}
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="1.6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>

          {/* Top arc for place name.
              r=87 sits midway in the 22px ring gap (outer r=97, inner r=75).
              sweep=0 (counterclockwise) from left → right = passes through the TOP.
              Text on this path renders readable (not inverted) at the top. */}
          <path id={`arc-${uid}`} d="M 18,105 A 87,87 0 0,0 192,105" />
        </defs>

        <g filter={`url(#ink-${uid})`}>

          {/* ── Outer solid ring ── */}
          <circle cx="105" cy="105" r="97"
            fill="none" stroke={color.border} strokeWidth="3" />

          {/* ── Inner dashed ring — adds stamp character ── */}
          <circle cx="105" cy="105" r="75"
            fill="none" stroke={color.border} strokeWidth="1"
            strokeDasharray="3 2.5" />

          {/* ── Cardinal tick marks inside the outer ring ──
               Real rubber stamps have division marks at 12/3/6/9 o'clock.
               Each tick goes from just inside the outer ring inward by 9px. */}
          {/* Top    */ }  <line x1="105" y1="11" x2="105" y2="20" stroke={color.border} strokeWidth="1.5" />
          {/* Bottom */ }  <line x1="105" y1="190" x2="105" y2="199" stroke={color.border} strokeWidth="1.5" />
          {/* Left   */ }  <line x1="11" y1="105" x2="20" y2="105" stroke={color.border} strokeWidth="1.5" />
          {/* Right  */ }  <line x1="190" y1="105" x2="199" y2="105" stroke={color.border} strokeWidth="1.5" />

          {/* ── Place name curved along top ring ── */}
          <text
            fontSize="8.5"
            fill={color.text}
            fontFamily="'Bitter', Georgia, serif"
            fontWeight="700"
            letterSpacing="2.5"
          >
            <textPath href={`#arc-${uid}`} startOffset="50%" textAnchor="middle">
              {placeName}
            </textPath>
          </text>

          {/* ── Activity icon ── */}
          <text x="105" y="84" textAnchor="middle" fontSize="20">
            {icon}
          </text>

          {/* ── Day + month — the centrepiece ── */}
          <text
            x="105" y="110"
            textAnchor="middle"
            fontSize="25"
            fontWeight="700"
            fill={color.text}
            fontFamily="'Bitter', Georgia, serif"
            letterSpacing="1"
          >
            {dayNum} {monthAbbr}
          </text>

          {/* ── Year ── */}
          <text
            x="105" y="127"
            textAnchor="middle"
            fontSize="12"
            fill={color.text}
            fontFamily="'Bitter', Georgia, serif"
            letterSpacing="3"
          >
            {String(year)}
          </text>

          {/* ── Thin separator ── */}
          <line
            x1="74" y1="134" x2="136" y2="134"
            stroke={color.border} strokeWidth="0.75" opacity="0.5"
          />

          {/* ── Activity type ── */}
          <text
            x="105" y="148"
            textAnchor="middle"
            fontSize="7.5"
            fill={color.text}
            fontFamily="'Assistant', system-ui, sans-serif"
            letterSpacing="2.5"
          >
            {entry.activity.toUpperCase()}
          </text>

        </g>
      </svg>
    </button>
  );
}
