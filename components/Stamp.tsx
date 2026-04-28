import { Entry } from "@/types/entry";

type Props = {
  entry: Entry;
  monthIndex: number;
  onClick: () => void;
};

const STAMP_COLORS = [
  { border: "#FFC629", text: "#6B4C00" },
  { border: "#00BFA5", text: "#005C50" },
  { border: "#8B7EC8", text: "#3D2E8C" },
  { border: "#FF9A76", text: "#7A2800" },
  { border: "#8EDCB4", text: "#1A5C3A" },
  { border: "#EF4A2E", text: "#7A1500" },
];

const STAMP_COLOR_MAP: Record<string, { border: string; text: string }> = {
  sunshine: { border: "#FFC629", text: "#6B4C00" },
  teal:     { border: "#00BFA5", text: "#005C50" },
  lavender: { border: "#8B7EC8", text: "#3D2E8C" },
  peach:    { border: "#FF9A76", text: "#7A2800" },
  mint:     { border: "#8EDCB4", text: "#1A5C3A" },
  coral:    { border: "#EF4A2E", text: "#7A1500" },
  cyan:     { border: "#00ADEF", text: "#00487A" },
};

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
  const color = (entry.stampColor && STAMP_COLOR_MAP[entry.stampColor])
    ? STAMP_COLOR_MAP[entry.stampColor]
    : STAMP_COLORS[monthIndex % STAMP_COLORS.length];
  const rotation = ROTATIONS[monthIndex % ROTATIONS.length];
  const icon     = getIcon(entry.activity);
  const uid      = `s${monthIndex}`;

  const [year, month, day] = entry.date.split("-").map(Number);
  const dateObj   = new Date(year, month - 1, day);
  const dayNum    = String(day);
  const monthAbbr = dateObj
    .toLocaleDateString("en-US", { month: "short" })
    .toUpperCase();

  const placeName = entry.place.toUpperCase().slice(0, 22);

  return (
    <div className="relative inline-block cursor-pointer">
      <button
        onClick={onClick}
        aria-label={`View details for ${entry.place}`}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded-full"
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
            <path id={`arc-${uid}`} d="M 18,105 A 87,87 0 0,0 192,105" />
          </defs>

          <g filter={`url(#ink-${uid})`}>
            <circle cx="105" cy="105" r="97" fill="none" stroke={color.border} strokeWidth="3" />
            <circle cx="105" cy="105" r="75" fill="none" stroke={color.border} strokeWidth="1" strokeDasharray="3 2.5" />
            <line x1="105" y1="11"  x2="105" y2="20"  stroke={color.border} strokeWidth="1.5" />
            <line x1="105" y1="190" x2="105" y2="199" stroke={color.border} strokeWidth="1.5" />
            <line x1="11"  y1="105" x2="20"  y2="105" stroke={color.border} strokeWidth="1.5" />
            <line x1="190" y1="105" x2="199" y2="105" stroke={color.border} strokeWidth="1.5" />

            <text fontSize="8.5" fill={color.text} fontFamily="'Bitter', Georgia, serif" fontWeight="700" letterSpacing="2.5">
              <textPath href={`#arc-${uid}`} startOffset="50%" textAnchor="middle">
                {placeName}
              </textPath>
            </text>

            <text x="105" y="84" textAnchor="middle" fontSize="20">{icon}</text>

            <text x="105" y="110" textAnchor="middle" fontSize="25" fontWeight="700"
              fill={color.text} fontFamily="'Bitter', Georgia, serif" letterSpacing="1">
              {dayNum} {monthAbbr}
            </text>

            <text x="105" y="127" textAnchor="middle" fontSize="12"
              fill={color.text} fontFamily="'Bitter', Georgia, serif" letterSpacing="3">
              {String(year)}
            </text>

            <line x1="74" y1="134" x2="136" y2="134" stroke={color.border} strokeWidth="0.75" opacity="0.5" />

            <text x="105" y="148" textAnchor="middle" fontSize="7.5"
              fill={color.text} fontFamily="'Assistant', system-ui, sans-serif" letterSpacing="2.5">
              {entry.activity.toUpperCase()}
            </text>
          </g>
        </svg>
      </button>
    </div>
  );
}
