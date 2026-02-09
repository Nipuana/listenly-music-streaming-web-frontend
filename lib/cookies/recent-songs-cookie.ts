import { PlayerSong } from "@/Providers/Contexts/player-context";

export interface RecentSongEntry {
  song: PlayerSong;
  playedAt: number; // timestamp
}

const RECENT_SONGS_COOKIE = "recent_songs";
const MAX_RECENT_SONGS = 3;
const COOKIE_EXPIRY_DAYS = 30;

/**
 * Get recent songs from cookies
 */
export const getRecentSongs = (): RecentSongEntry[] => {
  if (typeof window === "undefined") return [];

  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${RECENT_SONGS_COOKIE}=`));

    if (!cookie) return [];

    const value = cookie.split("=")[1];
    const decoded = decodeURIComponent(value);
    const recentSongs: RecentSongEntry[] = JSON.parse(decoded);

    // Validate and filter out invalid entries
    return recentSongs.filter(
      (entry) =>
        entry &&
        entry.song &&
        entry.song.id &&
        entry.song.title &&
        typeof entry.playedAt === "number"
    );
  } catch (error) {
    console.error("Error parsing recent songs cookie:", error);
    return [];
  }
};

/**
 * Add a song to recent songs (maintains only 3 most recent)
 */
export const addRecentSong = (song: PlayerSong): void => {
  if (typeof window === "undefined") return;

  try {
    const recentSongs = getRecentSongs();

    // Remove if song already exists (to avoid duplicates)
    const filtered = recentSongs.filter((entry) => entry.song.id !== song.id);

    // Add new entry at the beginning
    const newEntry: RecentSongEntry = {
      song,
      playedAt: Date.now(),
    };

    // Keep only the 3 most recent
    const updated = [newEntry, ...filtered].slice(0, MAX_RECENT_SONGS);

    // Set cookie
    const value = encodeURIComponent(JSON.stringify(updated));
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + COOKIE_EXPIRY_DAYS);

    document.cookie = `${RECENT_SONGS_COOKIE}=${value}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
  } catch (error) {
    console.error("Error updating recent songs cookie:", error);
  }
};

/**
 * Clear all recent songs
 */
export const clearRecentSongs = (): void => {
  if (typeof window === "undefined") return;

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() - 1); // Set to past date to expire

  document.cookie = `${RECENT_SONGS_COOKIE}=; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
};