"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Entry } from "@/types/entry";
import PhotoCard from "@/components/PhotoCard";

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

function ChevronLeft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M13 4L7 10L13 16" stroke="#252F6A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M7 4L13 10L7 16" stroke="#252F6A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function EntryModal({ entry, onClose }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState(-1);

  const photos = entry?.photos ?? [];
  const hasLightbox = lightboxIdx >= 0;

  useEffect(() => {
    if (!entry) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (hasLightbox) setLightboxIdx(-1);
        else onClose();
        return;
      }
      if (hasLightbox) {
        if (e.key === "ArrowLeft"  && lightboxIdx > 0)                 setLightboxIdx(i => i - 1);
        if (e.key === "ArrowRight" && lightboxIdx < photos.length - 1) setLightboxIdx(i => i + 1);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [entry, hasLightbox, lightboxIdx, photos.length, onClose]);

  useEffect(() => { setLightboxIdx(-1); }, [entry]);

  if (!entry) return null;

  const lightboxPhoto = hasLightbox ? photos[lightboxIdx] : null;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 bg-navy/60 z-40 hidden sm:block"
        onClick={onClose}
      />

      {/* ── Modal panel ── */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto paper-texture sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[88vh] sm:rounded-lg"
        style={{ backgroundColor: "#FAF8F3" }}
      >
        {/* ── Sticky header ── */}
        <div
          className="sticky top-0 z-10 bg-light-gray px-8 pt-6 pb-5 flex items-start gap-4 sm:rounded-t-lg"
          style={{ boxShadow: "0 1px 0 rgba(51,65,85,0.12), 0 2px 8px rgba(51,65,85,0.06)" }}
        >
          <div className="flex-1 min-w-0">
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

          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 text-dark-gray hover:text-navy text-3xl leading-none font-light mt-0.5"
          >
            ×
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-8 py-8 space-y-8">

          <section>
            <p className="font-body text-dark-gray uppercase mb-3" style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}>
              What happened
            </p>
            <p className="font-heading text-lg text-dark-gray leading-relaxed">
              {entry.summary}
            </p>
          </section>

          {entry.blurbs.length > 0 && (
            <section>
              <p className="font-body text-dark-gray uppercase mb-4" style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}>
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
          )}

          {photos.length > 0 && (
            <section>
              <p className="font-body text-dark-gray uppercase mb-3" style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}>
                Photos
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {photos.map((photo, i) => (
                  <PhotoCard
                    key={i}
                    photo={photo}
                    entryId={entry.id}
                    onImageClick={() => setLightboxIdx(i)}
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightboxPhoto && (
        <>
          {/* Dark backdrop — clicking it closes */}
          <div
            className="fixed inset-0 bg-black/88 z-[60]"
            onClick={() => setLightboxIdx(-1)}
          />

          {/* Photo + close + arrows (pointer-events-none so backdrop click falls through) */}
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-10 pointer-events-none">
            <div className="relative w-full h-full max-w-3xl">

              {/* Close — anchored just above top-right of the photo container */}
              <button
                onClick={() => setLightboxIdx(-1)}
                className="absolute -top-9 right-0 text-white/80 hover:text-white text-3xl leading-none font-light pointer-events-auto"
                aria-label="Close photo"
              >
                ×
              </button>

              <Image
                src={`/photos/${entry.id}/${lightboxPhoto.filename}`}
                alt={lightboxPhoto.caption ?? "Team photo"}
                fill
                sizes="(max-width: 640px) 95vw, 80vw"
                className="object-contain pointer-events-none"
              />

              {/* Prev — anchored to left edge of photo container */}
              {lightboxIdx > 0 && (
                <button
                  onClick={() => setLightboxIdx(i => i - 1)}
                  className="absolute top-1/2 -translate-y-1/2 -left-5 sm:-left-16 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/92 shadow-md flex items-center justify-center hover:scale-110 hover:bg-white transition-all duration-150 pointer-events-auto"
                  aria-label="Previous photo"
                >
                  <ChevronLeft />
                </button>
              )}

              {/* Next — anchored to right edge of photo container */}
              {lightboxIdx < photos.length - 1 && (
                <button
                  onClick={() => setLightboxIdx(i => i + 1)}
                  className="absolute top-1/2 -translate-y-1/2 -right-5 sm:-right-16 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/92 shadow-md flex items-center justify-center hover:scale-110 hover:bg-white transition-all duration-150 pointer-events-auto"
                  aria-label="Next photo"
                >
                  <ChevronRight />
                </button>
              )}

            </div>
          </div>

          {lightboxPhoto.caption && (
            <div className="fixed bottom-6 left-0 right-0 z-[62] flex justify-center pointer-events-none">
              <p className="font-body italic text-white/80 text-sm bg-black/40 px-4 py-1.5 rounded-full">
                {lightboxPhoto.caption}
              </p>
            </div>
          )}
        </>
      )}
    </>
  );
}
