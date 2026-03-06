import type { ReactNode } from "react";
import { PlayerBar } from "@/components/layout/player-bar";

export default function ArtistLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <PlayerBar />
    </>
  );
}
