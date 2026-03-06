import { useCallback, useEffect, useState } from "react";
import { listArtistVerificationRequests } from "@/lib/api/api-calls/admin_APIs/artist-verification";

export default function useAdminArtistVerificationStats() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    under_review: 0,
    approved: 0,
    rejected: 0,
    flagged: 0,
  });

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const resp = await listArtistVerificationRequests();
      const arr = Array.isArray(resp) ? resp : (resp?.data ?? resp?.requests ?? resp?.results ?? resp?.items ?? []);
      const c = { total: 0, pending: 0, under_review: 0, approved: 0, rejected: 0, flagged: 0 };
      c.total = arr.length;
      for (const r of arr) {
        const s = String(r?.status || "").toLowerCase();
        if (s === "pending") c.pending += 1;
        else if (s === "under_review" || s === "under review") c.under_review += 1;
        else if (s === "approved") c.approved += 1;
        else if (s === "declined" || s === "rejected") c.rejected += 1;
        else if (s === "flagged") c.flagged += 1;
      }
      setCounts(c);
      return c;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
      setCounts({ total: 0, pending: 0, under_review: 0, approved: 0, rejected: 0, flagged: 0 });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const refetch = useCallback(() => fetchAll(), [fetchAll]);

  return { ...counts, loading, error, refetch } as const;
}
