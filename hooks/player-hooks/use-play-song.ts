"use client";

import { useCallback } from "react";
import { usePlayer, type PlayerSong } from "@/Providers/Contexts/player-context";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  audioUrl?: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; [key: string]: unknown };
  createdAt?: string;
}

/**
 * Utility hook for playing songs consistently across the application
 * Handles transformation from component Song interface to PlayerSong interface
 * and provides standardized play functionality
 */
export const usePlaySong = () => {
  const { playSong, playQueue } = usePlayer();

  /**
   * Play a single song
   */
  const playSingleSong = useCallback((song: Song) => {
    const playerSong: PlayerSong = {
      id: song.id,
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      duration: song.duration,
      coverImageUrl: song.coverImageUrl,
      audioUrl: song.audioUrl,
      uploadedBy: song.uploadedBy,
    };

    playSong(playerSong);
  }, [playSong]);

  /**
   * Play a song at a specific index in a queue
   */
  const playSongInQueue = useCallback((songs: Song[], index: number) => {
    if (!songs.length) return;

    const safeIndex = Math.min(Math.max(index, 0), songs.length - 1);

    const playerSongs: PlayerSong[] = songs.map(song => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      genre: song.genre,
      duration: song.duration,
      coverImageUrl: song.coverImageUrl,
      audioUrl: song.audioUrl,
      uploadedBy: song.uploadedBy,
    }));

    playQueue(playerSongs, safeIndex);
  }, [playQueue]);

  /**
   * Play all songs in an array starting from index 0
   */
  const playAllSongs = useCallback((songs: Song[]) => {
    if (!songs.length) return;
    playSongInQueue(songs, 0);
  }, [playSongInQueue]);

  /**
   * Play songs in shuffled order
   */
  const playShuffled = useCallback((songs: Song[]) => {
    if (!songs.length) return;

    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    playSongInQueue(shuffled, 0);
  }, [playSongInQueue]);

  return {
    playSingleSong,
    playSongInQueue,
    playAllSongs,
    playShuffled,
  };
};