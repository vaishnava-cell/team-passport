import { Entry } from "@/types/entry";

type Props = {
  entry: Entry | null;
  onClose: () => void;
};

function formatFullDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function EntryModal({ entry, onClose }: Props) {
  if (!entry) return null;

  return (
    <>
      {/* Backdrop — desktop only */}
      <div
        className="fixed inset-0 bg-navy/60 z-40 hidden sm:block"
        onClick={onClose}
      />

      {/* Panel — full-screen mobile, centered card desktop */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto paper-texture sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[88vh] sm:rounded-lg"
        style={{ backgroundColor: "#FAF8F3" }}
      >

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-5 text-dark-gray hover:text-navy text-3xl leading-none font-light z-10"
        >
          ×
        </button>

        {/* Header — light-gray band */}
        <div className="bg-light-gray px-8 pt-10 pb-6 border-b border-dark-gray/10">
          <p
            className="font-body text-dark-gray uppercase mb-1"
            style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}
          >
            {entry.activity} · {entry.time}
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-navy leading-tight">
            {entry.place}
          </h2>
          <p className="font-body text-sm text-dark-gray mt-1">
            {formatFullDate(entry.date)}
          </p>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-8">

          {/* Summary */}
          <section>
            <p
              className="font-body text-dark-gray uppercase mb-3"
              style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}
            >
              What happened
            </p>
            <p className="font-heading text-lg text-dark-gray leading-relaxed">
              {entry.summary}
            </p>
          </section>

          {/* Blurbs */}
          <section>
            <p
              className="font-body text-dark-gray uppercase mb-4"
              style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}
            >
              The team says
            </p>
            <div className="space-y-3">
              {entry.blurbs.map((blurb, i) => (
                <div key={i} className="bg-light-gray rounded-lg p-5">
                  <p className="font-heading text-base text-dark-gray italic leading-relaxed mb-2">
                    &ldquo;{blurb.text}&rdquo;
                  </p>
                  <p className="font-body text-sm font-semibold text-navy">
                    — {blurb.name}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Photos */}
          <section>
            <p
              className="font-body text-dark-gray uppercase mb-3"
              style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}
            >
              Photos
            </p>
            {entry.photos.length === 0 ? (
              <p className="font-body text-sm text-dark-gray italic">No photos yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {entry.photos.map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-light-gray rounded-lg flex items-center justify-center"
                  >
                    <span className="font-body text-xs text-dark-gray">Photo {i + 1}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </div>
    </>
  );
}
