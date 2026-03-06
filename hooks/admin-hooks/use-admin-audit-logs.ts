import { useCallback, useEffect, useState } from 'react';
import { listAuditLogs, getAuditLogById } from '@/lib/api/api-calls/admin_APIs/audit-logs';

type Params = Record<string, string | number> | undefined;

function extractLogsArray(payload: unknown): any[] {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== 'object') return [];
  const obj = payload as Record<string, unknown>;
  // common shapes: { data: [...]} or { items: [...] } or direct array
  const candidate = (obj.data ?? obj.items ?? obj.results ?? obj.logs ?? obj.records) as unknown;
  return Array.isArray(candidate) ? (candidate as any[]) : [];
}

export function useAdminAuditLogs(initialParams?: Params) {
  const [params, setParams] = useState<Params>(initialParams);
  const [logs, setLogs] = useState<any[]>([]);
  const [meta, setMeta] = useState<{ total?: number; page?: number; limit?: number }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (p?: Params) => {
    setLoading(true);
    setError(null);
    try {
      const resp = await listAuditLogs(p ?? params);
      // extract items array
      const arr = extractLogsArray(resp);
      setLogs(arr);

      // extract pagination meta if present
      try {
        const raw = resp as any;
        const candidateTotal = raw.total ?? raw.count ?? raw.meta?.total ?? raw.pagination?.total ?? raw.data?.total;
        const candidatePage = raw.page ?? raw.meta?.page ?? raw.pagination?.page ?? raw.data?.page;
        const candidateLimit = raw.limit ?? raw.meta?.limit ?? raw.pagination?.limit ?? raw.data?.limit;
        setMeta({
          total: typeof candidateTotal === 'number' ? candidateTotal : candidateTotal ? Number(candidateTotal) : undefined,
          page: typeof candidatePage === 'number' ? candidatePage : candidatePage ? Number(candidatePage) : undefined,
          limit: typeof candidateLimit === 'number' ? candidateLimit : candidateLimit ? Number(candidateLimit) : undefined,
        });
      } catch (e) {
        setMeta({});
      }

      return arr;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load audit logs';
      setError(message);
      setLogs([]);
      return [] as any[];
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    void fetchLogs(params);
  }, [fetchLogs, params]);

  const refetch = useCallback(() => fetchLogs(params), [fetchLogs, params]);

  return { logs, loading, error, params, setParams, refetch, meta: (meta as { total?: number; page?: number; limit?: number }) } as const;
}

export function useAdminAuditLog(id?: string | null) {
  const [log, setLog] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLog = useCallback(async (logId?: string | null) => {
    if (!logId) return null;
    setLoading(true);
    setError(null);
    try {
      const resp = await getAuditLogById(logId);
      const payload = (resp && typeof resp === 'object' && 'data' in (resp as Record<string, unknown>)) ? (resp as any).data : resp;
      setLog(payload ?? null);
      return payload ?? null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load audit log';
      setError(message);
      setLog(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) void fetchLog(id);
  }, [id, fetchLog]);

  const refetch = useCallback(() => fetchLog(id), [fetchLog, id]);

  return { log, loading, error, refetch } as const;
}

export default useAdminAuditLogs;
