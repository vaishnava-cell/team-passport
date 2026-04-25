export type Blurb = {
  name: string;
  text: string;
};

export type Photo = {
  filename: string;
  caption?: string;
};

export type Entry = {
  id: string;
  place: string;
  date: string;         // ISO format, e.g. "2026-01-23"
  time: string;         // e.g. "11:30 AM" or "11:30 AM – 2:30 PM"
  activity: string;     // e.g. "Working lunch", "Golf at Back 9"
  summary: string;
  blurbs: Blurb[];
  photos: Photo[];
  stampImage: string | null;
  partySize: number;
  favoriteDish: string;
  stampColor?: string;         // named color: "coral" | "sunshine" | "cyan" | etc.
  borderEmoji: string | string[]; // single emoji, or array that alternates around the border
};
