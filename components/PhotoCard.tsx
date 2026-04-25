"use client";

import { useState } from "react";
import Image from "next/image";
import { Photo } from "@/types/entry";

type Props = {
  photo: Photo;
  entryId: string;
  onImageClick: (photo: Photo) => void;
};

export default function PhotoCard({ photo, entryId, onImageClick }: Props) {
  const [errored, setErrored] = useState(false);
  const src = `/photos/${entryId}/${photo.filename}`;

  return (
    <figure className="flex flex-col gap-1">
      <button
        onClick={() => !errored && onImageClick(photo)}
        className="block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-navy rounded"
        aria-label={photo.caption ?? `View photo ${photo.filename}`}
      >
        <div className="relative aspect-[4/3] rounded overflow-hidden border border-dark-gray/10 bg-light-gray">
          {errored ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-body text-dark-gray" style={{ fontSize: "0.65rem" }}>
                Photo unavailable
              </span>
            </div>
          ) : (
            <Image
              src={src}
              alt={photo.caption ?? "Team photo"}
              fill
              sizes="(max-width: 640px) 45vw, 220px"
              className="object-cover hover:scale-[1.03] transition-transform duration-300"
              onError={() => {
                console.warn(`Photo not found: ${src}`);
                setErrored(true);
              }}
            />
          )}
        </div>
      </button>

      {photo.caption && (
        <figcaption
          className="font-body italic text-dark-gray text-center leading-snug px-1"
          style={{ fontSize: "0.62rem" }}
        >
          {photo.caption}
        </figcaption>
      )}
    </figure>
  );
}
