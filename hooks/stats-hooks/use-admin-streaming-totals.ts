import { useEffect, useState } from "react";
import { getAllSongs } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";

export interface AdminStreamingTotals {
  songCount: number;
  totalStreams: number;
  totalListenTimeSeconds: number;
  totalStreamingHours: number;
}

function toNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function extractSongsArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  const candidate = obj.data ?? obj.songs ?? obj.results;
  return Array.isArray(candidate) ? candidate : [];
}

function getNumberField(source: Record<string, unknown>, keys: string[]): number {
  for (const key of keys) {
    const value = toNumber(source[key]);
    if (value) return value;
  }
  return 0;
}

export function useAdminStreamingTotals() {
  const [totals, setTotals] = useState<AdminStreamingTotals>({
    songCount: 0,
    totalStreams: 0,
    totalListenTimeSeconds: 0,
    totalStreamingHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        const response = await getAllSongs();
        const songs = extractSongsArray(response);

        const computed = songs.reduce<AdminStreamingTotals>(
          (acc, song) => {
            const songObj: Record<string, unknown> =
              song && typeof song === "object" ? (song as Record<string, unknown>) : {};

            acc.songCount += 1;

            const playCount = getNumberField(songObj, ["playCount", "play_count", "plays"]);

            const listenTimeSeconds = getNumberField(songObj, [
              "listenTimeSeconds",
              "listenTime",
              "listen_time_seconds",
              "totalListenTimeSeconds",
              "totalListenTime",
            ]);

            acc.totalStreams += playCount;
            acc.totalListenTimeSeconds += listenTimeSeconds;
            return acc;
          },
          {
            songCount: 0,
            totalStreams: 0,
            totalListenTimeSeconds: 0,
            totalStreamingHours: 0,
          }
        );

        computed.totalStreamingHours = computed.totalListenTimeSeconds / 3600;

        if (!cancelled) {
          setTotals(computed);
          setError(null);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load streaming totals";
          setError(message);
          setTotals({
            songCount: 0,
            totalStreams: 0,
            totalListenTimeSeconds: 0,
            totalStreamingHours: 0,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  return { totals, loading, error };
}
