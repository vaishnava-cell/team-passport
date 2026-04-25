export type Blurb = {
  name: string;
  text: string;
};

export type Entry = {
  id: string;
  place: string;
  date: string;       // ISO format, e.g. "2026-03-15"
  time: string;       // e.g. "1:00 PM"
  activity: string;   // e.g. "mini-golf", "lunch"
  summary: string;
  blurbs: Blurb[];
  photos: string[];   // paths like "/photos/golf-1.jpg"
  stampImage: string | null;
};
