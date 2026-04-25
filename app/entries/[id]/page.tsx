import Link from "next/link";
import { notFound } from "next/navigation";
import entriesData from "@/data/entries.json";
import { Entry } from "@/types/entry";

const entries = entriesData as Entry[];

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EntryPage({ params }: Props) {
  const { id } = await params;
  const entry = entries.find((e) => e.id === id);

  if (!entry) notFound();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <Link href="/" className="text-sm text-gray-500 hover:underline mb-6 block">
        ← Back to all outings
      </Link>

      <h1 className="text-3xl font-bold">{entry.place}</h1>
      <p className="text-gray-500 mt-1 mb-6">
        {entry.date} · {entry.time} · {entry.activity}
      </p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">What happened</h2>
        <p className="text-gray-700 leading-relaxed">{entry.summary}</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">The team says</h2>
        <ul className="space-y-3">
          {entry.blurbs.map((blurb, i) => (
            <li key={i} className="border-l-4 border-gray-200 pl-4">
              <span className="font-medium">{blurb.name}:</span>{" "}
              <span className="text-gray-600">{blurb.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Photos</h2>
        {entry.photos.length === 0 ? (
          <p className="text-gray-400 italic">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {entry.photos.map((path, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-100 rounded flex items-center justify-center"
              >
                <span className="text-xs text-gray-400 text-center px-2 break-all">{path}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
