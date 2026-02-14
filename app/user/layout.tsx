import type { ReactNode } from "react";
import { PlayerBar } from "@/components/layout/player-bar";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <PlayerBar />
    </>
  );
}
