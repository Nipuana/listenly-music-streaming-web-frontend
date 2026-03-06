"use client";

import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type LogItem = {
  id: string;
  timestamp: string;
  action: string;
  description: string;
  actor: { name: string; ip: string; country?: string; userAgent?: string };
  method?: string;
  path?: string;
  statusCode?: number | string;
  durationMs?: number;
  category?: string;
  severity?: 'info' | 'warning' | 'critical' | 'success';
  target?: { type?: string; name?: string } | undefined;
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function shortAgent(agent?: string) {
  if (!agent) return '—';
  if (agent.length < 40) return agent;
  return agent.slice(0, 36) + '…';
}

function renderDescription(desc?: string | null) {
  if (!desc) return <span>—</span>;
  if (desc.includes(',')) {
    const parts = desc.split(',');
    return (
      <div>
        {parts.map((p, i) => (
          <div key={i} className="leading-relaxed">
            {p.trim()}{i < parts.length - 1 ? ',' : ''}
          </div>
        ))}
      </div>
    );
  }
  return <span>{desc}</span>;
}

export default function AuditLogRow({ log, compact = false }: { log: LogItem, compact?: boolean }) {
  if (compact) {
    return (
      <div className="grid grid-cols-[180px_1fr_260px] gap-4 items-start py-3 border-b border-border px-2">
        <div className="text-xs">
          <div className="font-medium text-foreground">{timeAgo(log.timestamp)}</div>
          <div className="text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{log.action ?? (log.method ? `${log.method} ${log.path ?? ''}` : log.path ?? 'unknown')}</span>
            <Badge className="text-xs px-1 py-0 border bg-muted text-muted-foreground">{log.category ?? 'security'}</Badge>
          </div>
          <div className="text-sm text-muted-foreground whitespace-normal break-words mt-1">{renderDescription(log.description)}</div>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs bg-slate-200 text-slate-600">{(log.actor?.name ?? 'S').charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-foreground">{log.actor?.name ?? 'System'}</div>
            <div className="text-xs text-muted-foreground">{log.actor?.ip} · {shortAgent(log.actor?.userAgent)}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 group cursor-default">
      <div className="shrink-0 flex flex-col items-center z-10">
        <div className={`w-10 h-10 rounded-full border-2 border-background flex items-center justify-center ${log.severity === 'critical' ? 'bg-red-500' : log.severity === 'warning' ? 'bg-amber-500' : 'bg-[#476FE9]'}`}>
          <div className="text-white scale-75">
            {log.severity === 'critical' ? <ShieldAlert className="w-4 h-4" /> : <Info className="w-4 h-4" />}
          </div>
        </div>
      </div>

      <div className={`flex-1 p-4 rounded-xl border bg-card shadow-sm ${log.severity === 'critical' ? 'border-red-200' : 'border-border'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-semibold text-foreground">{log.action ?? (log.method ? `${log.method} ${log.path ?? ''}` : log.path ?? 'unknown')}</span>
              <Badge className="text-xs px-1.5 py-0 border bg-muted text-muted-foreground">{log.category ?? 'security'}</Badge>
            </div>

            <p className="text-sm text-foreground leading-relaxed whitespace-normal break-words">{renderDescription(log.description)}</p>

            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="text-xs bg-slate-200 text-slate-600">⚙</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-foreground font-medium">{log.actor?.name ?? 'System'}</div>
                  <div className="text-xs">{log.actor?.ip} · {shortAgent(log.actor?.userAgent)}</div>
                </div>
              </div>

              {log.target && (
                <div className="ml-2">
                  <span className="text-xs text-muted-foreground">Target:</span>
                  <Badge variant="secondary" className="text-xs ml-1">{log.target.type}: {log.target.name}</Badge>
                </div>
              )}

              <div className="ml-auto text-xs">
                <span className="font-mono">{log.statusCode ?? '—'}</span>
                {log.durationMs !== undefined && <span className="ml-2">· {log.durationMs}ms</span>}
              </div>
            </div>
          </div>

          <div className="text-right flex-shrink-0 text-xs text-muted-foreground">
            <div className="font-medium text-foreground">{timeAgo(log.timestamp)}</div>
            <div>{new Date(log.timestamp).toLocaleString()}</div>
            <div className="font-mono">{log.id}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
