"use client";

import React from "react";

export const GENRE_OPTIONS = [
  "pop",
  "rock",
  "hip-hop",
  "electronic",
  "soul",
  "country",
  "jazz",
  "classical",
  "latin",
  "folk",
  "blues",
  "reggae",
  "metal",
  "gospel",
  "other",
];

export default function GenreSelect({ value, onChange }: { value?: string; onChange?: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {GENRE_OPTIONS.map((g) => {
        const active = value === g;
        return (
          <button
            key={g}
            type="button"
            onClick={() => onChange?.(g)}
            className={
              `rounded-full px-3 py-1 text-sm transition-colors focus:outline-none ` +
              (active
                ? `bg-primary text-primary-foreground ring-2 ring-primary/30`
                : `bg-transparent border border-border text-muted-foreground hover:bg-primary/5`)
            }
          >
            {g}
          </button>
        );
      })}
    </div>
  );
}
