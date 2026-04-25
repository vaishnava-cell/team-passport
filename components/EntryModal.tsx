"use client";

import { useState } from "react";
import Image from "next/image";
import { Entry, Photo } from "@/types/entry";
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

export default function EntryModal({ entry, onClose }: Props) {
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  if (!entry) return null;

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
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-5 text-dark-gray hover:text-navy text-3xl leading-none font-light z-10"
        >
          ×
        </button>

        {/* Header */}
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
            <p className="font-body text-dark-gray uppercase mb-3" style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}>
              What happened
            </p>
            <p className="font-heading text-lg text-dark-gray leading-relaxed">
              {entry.summary}
            </p>
          </section>

          {/* Blurbs */}
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

          {/* Photos — hidden entirely if no photos */}
          {entry.photos.length > 0 && (
            <section>
              <p className="font-body text-dark-gray uppercase mb-3" style={{ fontSize: "0.65rem", letterSpacing: "0.25em" }}>
                Photos
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {entry.photos.map((photo, i) => (
                  <PhotoCard
                    key={i}
                    photo={photo}
                    entryId={entry.id}
                    onImageClick={setLightboxPhoto}
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
          <div
            className="fixed inset-0 bg-black/85 z-[60]"
            onClick={() => setLightboxPhoto(null)}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 pointer-events-none">
            <div className="relative w-full h-full max-w-3xl pointer-events-auto">
              <Image
                src={`/photos/${entry.id}/${lightboxPhoto.filename}`}
                alt={lightboxPhoto.caption ?? "Team photo"}
                fill
                sizes="(max-width: 640px) 95vw, 80vw"
                className="object-contain"
              />
            </div>
          </div>

          {/* Lightbox close + caption */}
          <div className="fixed top-4 right-4 z-[61] flex flex-col items-end gap-2 pointer-events-auto">
            <button
              onClick={() => setLightboxPhoto(null)}
              className="text-white/80 hover:text-white text-3xl leading-none font-light"
              aria-label="Close photo"
            >
              ×
            </button>
          </div>
          {lightboxPhoto.caption && (
            <div className="fixed bottom-6 left-0 right-0 z-[61] flex justify-center pointer-events-none">
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
