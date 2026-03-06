import { useCallback, useEffect, useState } from "react";
import {
  listArtistVerificationRequests,
  type ArtistVerificationRequestStatus,
} from "@/lib/api/api-calls/admin_APIs/artist-verification";
import { getUserById } from "@/lib/api/api-calls/admin_APIs/ad-users";

type RawResponse = unknown;

// Cache fetched user profiles to avoid repeated network calls during pagination
const userCache = new Map<string, any>();

function normalizeId(raw: unknown): string | null {
  if (!raw) return null;
  if (typeof raw === "string") {
    const s = raw.trim();
    // handle patterns like ObjectId("..."), ObjectId('...')
    const m = s.match(/^ObjectId\((?:"|')?([0-9a-fA-F]{24}|.+?)(?:"|')?\)$/);
    if (m) return m[1];
    return s;
  }
  if (typeof raw === "number") return String(raw);
  if (typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    if (typeof obj.$oid === "string") return obj.$oid;
    if (typeof obj._id === "string") return obj._id;
    if (typeof obj.id === "string") return obj.id;
    // fallback to toString if it gives a useful value
    try {
      const s = obj.toString();
      if (s && s !== "[object Object]") return s;
    } catch {}
  }
  return null;
}

function extractRequestsArray(payload: RawResponse): any[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  const candidate = obj.data ?? obj.requests ?? obj.results ?? obj.items;
  return Array.isArray(candidate) ? candidate : [];
}

export function useAdminArtistVerificationRequests(initialStatus?: ArtistVerificationRequestStatus) {
  const [status, setStatus] = useState<ArtistVerificationRequestStatus | undefined>(initialStatus);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = useCallback(async (s?: ArtistVerificationRequestStatus) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await listArtistVerificationRequests(s ?? status);
      const arr = extractRequestsArray(resp);

      // Prefetch user profiles for requests that reference a user id (prioritize top-level userId)
      const ids = new Set<string>();
      for (const r of arr) {
        const raw = r?.userId ?? r?.user?.id ?? r?.user?._id ?? r?.userId ?? r?.requesterId ?? r?.user_id ?? r?.requester ?? r?.requester_id ?? null;
        const id = normalizeId(raw);
        if (id) ids.add(id);
      }

      const idArray = Array.from(ids);
      const fetchedMap: Record<string, any> = {};
      const toFetch: string[] = [];
      for (const id of idArray) {
        if (userCache.has(id)) {
          fetchedMap[id] = userCache.get(id);
        } else {
          toFetch.push(id);
        }
      }

      if (toFetch.length > 0) {
        await Promise.all(
          toFetch.map(async (id) => {
            try {
              const u = await getUserById(id);
              const payload = u?.data ?? u ?? null;
              if (payload) {
                fetchedMap[id] = payload;
                userCache.set(id, payload);
              }
            } catch (err) {
              // ignore individual fetch errors
            }
          })
        );
      }

      // Attach fetched user (from cache or fresh fetch) to each request if available
      const merged = arr.map((r: any) => {
        const raw = r?.userId ?? r?.user?.id ?? r?.user?._id ?? r?.userId ?? r?.requesterId ?? r?.user_id ?? r?.requester ?? r?.requester_id ?? null;
        const id = normalizeId(raw);
        if (id && fetchedMap[id]) {
          return { ...r, user: fetchedMap[id] };
        }
        return r;
      });

      setRequests(merged);
      return merged;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load requests";
      setError(message);
      setRequests([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchRequests(status);
  }, [fetchRequests, status]);

  const refetch = useCallback(() => fetchRequests(status), [fetchRequests, status]);

  return {
    requests,
    loading,
    error,
    status,
    setStatus,
    refetch,
  } as const;
}

export default useAdminArtistVerificationRequests;
