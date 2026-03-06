import { PlayerSong } from "@/Providers/Contexts/player-context";

export interface SessionSongEntry {
  song: PlayerSong;
  playedAt: number;
}

const SESSION_SONGS_COOKIE = "session_songs";
const MAX_SESSION_SONGS = 50; // arbitrary cap to keep cookie small

// Retrieve songs played during current session
export const getSessionSongs = (): SessionSongEntry[] => {
  if (typeof window === "undefined") return [];

  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${SESSION_SONGS_COOKIE}=`));
    if (!cookie) return [];
    const value = cookie.split("=")[1];
    const decoded = decodeURIComponent(value);
    const entries: SessionSongEntry[] = JSON.parse(decoded);
    return Array.isArray(entries) ? entries : [];
  } catch (error) {
    console.error("Error parsing session songs cookie:", error);
    return [];
  }
};

// Add a song to the session list (most recent first)
export const addSessionSong = (song: PlayerSong): void => {
  if (typeof window === "undefined") return;

  try {
    const existing = getSessionSongs();
    // remove duplicates
    const filtered = existing.filter((e) => e.song.id !== song.id);
    const newEntry: SessionSongEntry = { song, playedAt: Date.now() };
    const updated = [newEntry, ...filtered].slice(0, MAX_SESSION_SONGS);

    const value = encodeURIComponent(JSON.stringify(updated));
    // session cookie: no expires / max-age
    document.cookie = `${SESSION_SONGS_COOKIE}=${value}; path=/; SameSite=Lax`;
  } catch (error) {
    console.error("Error updating session songs cookie:", error);
  }
};

// Clear the cookie (e.g. on logout)
export const clearSessionSongs = (): void => {
  if (typeof window === "undefined") return;
  document.cookie = `${SESSION_SONGS_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
};
