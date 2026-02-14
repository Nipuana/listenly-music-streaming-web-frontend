"use client";

import { useCallback } from "react";
import { usePlayer, type PlayerSong } from "@/Providers/Contexts/player-context";

export const usePlayQueue = (songs: PlayerSong[]) => {
  const { playQueue } = usePlayer();

  const playAll = useCallback(() => {
    if (!songs.length) return;
    playQueue(songs, 0);
  }, [songs, playQueue]);

  const playAtIndex = useCallback(
    (index: number) => {
      if (!songs.length) return;
      const safeIndex = Math.min(Math.max(index, 0), songs.length - 1);
      playQueue(songs, safeIndex);
    },
    [songs, playQueue]
  );

  const playShuffled = useCallback(() => {
    if (!songs.length) return;
    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    playQueue(shuffled, 0);
  }, [songs, playQueue]);

  return {
    playAll,
    playAtIndex,
    playShuffled,
  };
};
