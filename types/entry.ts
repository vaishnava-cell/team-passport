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
  date: string;       // ISO format, e.g. "2026-03-14"
  time: string;       // e.g. "3:00 PM"
  activity: string;   // e.g. "mini-golf", "lunch"
  summary: string;
  blurbs: Blurb[];
  photos: Photo[];
  stampImage: string | null;
  partySize: number;
  favoriteDish: string;
  borderEmoji: string;
};
