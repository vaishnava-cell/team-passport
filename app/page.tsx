import Link from "next/link";
import entriesData from "@/data/entries.json";
import { Entry } from "@/types/entry";

const entries = entriesData as Entry[];

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Team Passport</h1>
      <p className="text-gray-500 mb-8">Our monthly team outings, documented.</p>

      <ul className="space-y-4">
        {entries.map((entry) => (
          <li key={entry.id}>
            <Link
              href={`/entries/${entry.id}`}
              className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="font-semibold text-lg">{entry.place}</div>
              <div className="text-gray-500 text-sm mt-1">
                {entry.date} · {entry.activity}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
