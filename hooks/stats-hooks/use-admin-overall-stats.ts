import { useEffect, useState } from "react";
import { getOverallStats } from "@/lib/api/api-calls/admin_APIs/admin-stats";

export interface AdminOverallStats {
  songCount: number;
  totalStreams: number;
  totalListenTimeSeconds: number;
  totalStreamingHours: number;
  [key: string]: any;
}

export function useAdminOverallStats() {
  const [totals, setTotals] = useState<AdminOverallStats>({
    songCount: 0,
    totalStreams: 0,
    totalListenTimeSeconds: 0,
    totalStreamingHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch function exposed for refetch
  const fetchTotals = async () => {
    try {
      setLoading(true);
      const response = await getOverallStats();

      const safeNumber = (v: unknown) => {
        if (typeof v === "number" && Number.isFinite(v)) return v;
        if (typeof v === "string") {
          const p = Number(v);
          return Number.isFinite(p) ? p : 0;
        }
        return 0;
      };

      const songCount = safeNumber(response?.songCount ?? response?.song_count ?? response?.songs ?? 0);
      const totalStreams = safeNumber(response?.totalStreams ?? response?.total_streams ?? response?.streams ?? 0);
      const totalListenTimeSeconds = safeNumber(response?.totalListenTimeSeconds ?? response?.total_listen_time_seconds ?? response?.listenTimeSeconds ?? response?.totalListenTime ?? 0);

      const totalStreamingHours =
        safeNumber(response?.totalStreamingHours ?? response?.total_streaming_hours ?? response?.streamingHours) ||
        (totalListenTimeSeconds ? totalListenTimeSeconds / 3600 : 0);

      setTotals({ songCount, totalStreams, totalListenTimeSeconds, totalStreamingHours });
      setError(null);
    } catch (err: any) {
      setError(err?.message ?? String(err));
      setTotals({ songCount: 0, totalStreams: 0, totalListenTimeSeconds: 0, totalStreamingHours: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchTotals();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { totals, loading, error, refetch: fetchTotals } as const;
}
