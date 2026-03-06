"use client";

import React from 'react';
import { ShieldAlert, CalendarDays } from 'lucide-react';
import AuditLogRow from '@/app/admin/_components/security/AuditLogRow';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type Severity = 'info' | 'warning' | 'critical' | 'success';
type Category = 'auth' | 'user' | 'artist' | 'content' | 'payment' | 'admin' | 'system' | 'security';

import useAdminAuditLogs from '@/hooks/admin-hooks/use-admin-audit-logs';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

type AuditLog = any;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export default function SecurityLogsSection() {
  const { logs, loading, error, params, setParams, meta, refetch } = useAdminAuditLogs();
  // eslint-disable-next-line no-console
  console.log('[SecurityLogsSection] hook ->', { logs, loading, error, params, meta });

  function deriveSeverity(l: any): Severity {
    if (!l) return 'info';
    const sc = l.statusCode ?? l.status ?? (l.success === false ? 500 : undefined);
    if (typeof sc === 'number' && sc >= 500) return 'critical';
    if (typeof sc === 'number' && sc >= 400) return 'warning';
    if (l.severity) return l.severity as Severity;
    if (l.action && String(l.action).toLowerCase().includes('suspicious')) return 'critical';
    return 'info';
  }

  const normalized = (logs ?? []).map((l: any) => ({
    id: l._id ?? l.id ?? 'unknown',
    timestamp: l.createdAt ?? l.timestamp ?? l.date ?? new Date().toISOString(),
    // prefer explicit action, fallback to HTTP method + path
    action: l.action ?? (l.method ? `${l.method} ${l.path ?? ''}` : l.path ?? 'unknown'),
    description: typeof l.body === 'string' ? l.body : JSON.stringify(l.body ?? l.params ?? l.metadata ?? {}),
    // actor: try adminId, fallback to actor object or user object
    actor: {
      name: ((): string => {
        if (l.adminId) {
          try {
            if (typeof l.adminId === 'string') return l.adminId;
            if (typeof l.adminId === 'object' && l.adminId !== null) {
              return (
                (l.adminId.name ?? l.adminId.username ?? l.adminId.email) as string
                ?? (l.adminId._id ?? l.adminId.$oid ?? String(l.adminId))
              );
            }
            return String(l.adminId);
          } catch { return 'admin'; }
        }
        return l.actor?.name ?? l.user?.name ?? 'System';
      })(),
      ip: l.ip ?? l.actor?.ip ?? '—',
      country: l.country ?? l.actor?.country ?? '—',
      userAgent: l.userAgent ?? l.actor?.userAgent ?? '—',
    },
    method: l.method ?? undefined,
    path: l.path ?? undefined,
    statusCode: l.statusCode ?? l.status ?? (l.success === false ? 500 : undefined),
    durationMs: l.durationMs ?? l.duration ?? undefined,
    category: l.category ?? 'security',
    severity: deriveSeverity(l),
    target: l.target ?? undefined,
  }));

  // eslint-disable-next-line no-console
  console.log('[SecurityLogsSection] normalized ->', { count: (normalized ?? []).length, sample: (normalized ?? [])[0] ?? null });

  const total = (meta?.total ?? undefined) ?? normalized.length;
  const criticalCount = normalized.filter(n => n.severity === 'critical').length;
  const todayCount = normalized.filter(n => n.timestamp.startsWith(new Date().toISOString().slice(0,10))).length;

  // pagination state derived from params/meta
  const currentPage = Number(params?.page ?? meta?.page ?? 1);
  const currentLimit = Number(params?.limit ?? meta?.limit ?? 20);
  const totalPages = meta?.total ? Math.max(1, Math.ceil((meta.total ?? 0) / currentLimit)) : undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-br from-red-600 to-red-400 rounded-xl flex items-center justify-center text-white">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{loading ? '—' : total}</p>
                <p className="text-sm text-muted-foreground">Security events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-blue-400 rounded-xl flex items-center justify-center text-white">
                <CalendarDays className="w-4 h-4" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{loading ? '—' : todayCount}</p>
                <p className="text-sm text-muted-foreground">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {loading && <div className="text-sm text-muted-foreground">Loading audit logs…</div>}
        {error && <div className="text-sm text-destructive">{error}</div>}
        {!loading && !error && (
          <div>
            <div className="flex items-center justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted-foreground">Page size</label>
                <Select value={String(currentLimit)} onValueChange={(val) => {
                  const newLimit = Number(val);
                  setParams((old: any) => ({ ...(old ?? {}), page: 1, limit: newLimit }));
                }}>
                  <SelectTrigger id="logs-page-size" size="sm" className="ml-2 bg-background border-none rounded-md px-2 py-1 text-sm shadow-sm w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="w-24 bg-white dark:bg-background">
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground ml-4">{meta?.total ? `Total ${meta.total}` : `${normalized.length} shown`}</div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  disabled={currentPage <= 1}
                  onClick={() => setParams((old: any) => ({ ...(old ?? {}), page: Math.max(1, currentPage - 1), limit: currentLimit }))}
                >
                  Prev
                </button>
                <div className="text-sm text-muted-foreground">Page {currentPage}{totalPages ? ` of ${totalPages}` : ''}</div>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-50"
                  disabled={totalPages ? currentPage >= totalPages : normalized.length === 0}
                  onClick={() => setParams((old: any) => ({ ...(old ?? {}), page: currentPage + 1, limit: currentLimit }))}
                >
                  Next
                </button>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="hidden md:grid grid-cols-[180px_1fr_260px] gap-4 bg-muted p-3 text-xs font-medium text-muted-foreground">
                <div>Timestamp</div>
                <div>Event</div>
                <div>Actor</div>
              </div>
              <div>
                {normalized.map((log) => (
                  <AuditLogRow key={log.id} log={log} compact />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
