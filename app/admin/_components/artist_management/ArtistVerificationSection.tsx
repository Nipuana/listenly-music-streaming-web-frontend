"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic2 } from "lucide-react";
import useAdminArtistVerificationRequests from "@/hooks/admin-hooks/use-admin-artist-verification";
import useAdminArtistVerificationActions from "@/hooks/admin-hooks/use-admin-artist-verification-actions";
import useAdminArtistVerificationStats from "@/hooks/admin-hooks/use-admin-artist-verification-stats";
import ArtistVerificationRow from "./ArtistVerificationRow";
import { useMemo, useState, useEffect } from "react";

export default function ArtistVerificationSection() {
  const { requests, loading, error, status, setStatus, refetch } = useAdminArtistVerificationRequests();
  const { approving, declining, error: actionError, approveRequest, declineRequest } = useAdminArtistVerificationActions(refetch);
  const stats = useAdminArtistVerificationStats();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const allRows = requests ?? [];

  // precompute a small searchable string per row (space-efficient)
  const searchIndex = useMemo(() => {
    return allRows.map((r: any) => {
      const candidateId = String(r.id || r._id || r.userId || r.requesterId || "").toLowerCase();
      const name = String((r.user && (r.user.name || r.user.username)) || r.name || "").toLowerCase();
      const email = String(r.user?.email || r.email || "").toLowerCase();
      const created = r.createdAt ? String(r.createdAt).toLowerCase() : "";
      const combined = `${candidateId} ${name} ${email} ${created}`.replace(/\s+/g, " ").trim();
      return { r, combined };
    });
  }, [allRows]);

  // debounce input to reduce work while typing
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 220);
    return () => clearTimeout(t);
  }, [search]);

  // derived filtered rows by status and debounced search (tokenized AND semantics)
  const filteredRows = useMemo(() => {
    let list = searchIndex.map((s) => s.r);
    if (status) {
      list = list.filter((r: any) => (String(r.status || "")).toLowerCase() === String(status).toLowerCase());
    }
    if (debouncedSearch) {
      const tokens = debouncedSearch.split(/\s+/).filter(Boolean);
      if (tokens.length > 0) {
        list = list.filter((r: any) => {
          const entry = searchIndex.find((s) => s.r === r)?.combined ?? "";
          return tokens.every((tok) => entry.includes(tok));
        });
      }
    }
    return list;
  }, [searchIndex, status, debouncedSearch]);

  const rows = filteredRows;

  function scoreColor(score: number) {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  }

  const totalPages = useMemo(() => Math.max(1, Math.ceil((rows?.length ?? 0) / perPage)), [rows, perPage]);
  const paginated = useMemo(() => {
    if (!rows) return [];
    const start = (page - 1) * perPage;
    return rows.slice(start, start + perPage);
  }, [rows, page, perPage]);

  async function handleApprove(id: string, note?: string) {
    try {
      await approveRequest(id, note);
      await refetch();
      await stats.refetch();
    } catch (err) { }
  }

  async function handleDecline(id: string, note?: string) {
    try {
      await declineRequest(id, note);
      await refetch();
      await stats.refetch();
    } catch (err) { }
  }

  async function handleReset() {
    setSearch("");
    setDebouncedSearch("");
    setStatus(undefined);
    setPage(1);
    try {
      await refetch();
      await stats.refetch();
    } catch (err) { }
  }

  async function handleRefresh() {
    try {
      await refetch();
      await stats.refetch();
    } catch (err) { }
  }

  return (
    <section className="p-app-gutter">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3"><Mic2 /> Artist Verification</h2>
          <p className="text-sm text-muted-foreground">Admin Review Panel</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => window.location.href = '/admin/ad-dash'} className="px-4 py-2 font-semibold bg-primary text-primary-foreground hover:opacity-95">Admin Dashboard</Button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4 mb-6">
        <Card className="col-span-1">
          <CardContent>
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-xl font-bold">{stats.total ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent>
            <div className="text-xs text-muted-foreground">Pending</div>
            <div className="text-xl font-bold">{stats.pending ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent>
            <div className="text-xs text-muted-foreground">Under Review</div>
            <div className="text-xl font-bold">{stats.under_review ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent>
            <div className="text-xs text-muted-foreground">Approved</div>
            <div className="text-xl font-bold">{stats.approved ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent>
            <div className="text-xs text-muted-foreground">Rejected</div>
            <div className="text-xl font-bold">{stats.rejected ?? 0}</div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardContent>
            <div className="text-xs text-muted-foreground">Flagged</div>
            <div className="text-xl font-bold">{stats.flagged ?? 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Input placeholder="Search by name, email, or ID..." className="flex-1" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <div className="flex gap-2 items-center">
          <select value={status ?? ""} onChange={(e) => { setStatus(e.target.value as any); setPage(1); }} className="rounded-md px-3 py-2 bg-input border border-input text-foreground">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
          <Button variant="ghost" onClick={() => { void handleReset(); }}>Reset</Button>
          <Button variant="ghost" onClick={() => { void handleRefresh(); }}>Refresh</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Applications <span className="text-sm text-muted-foreground">({stats.total ?? 0})</span></CardTitle>
          <CardDescription>Review applications submitted by artists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed text-left">
              <thead className="text-xs text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-1/2">Artist</th>
                  <th className="py-3 px-4 w-1/6">Submitted</th>
                  <th className="py-3 px-4 w-1/6">Status</th>
                  <th className="py-3 px-4 w-1/6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((r: any) => (
                  <ArtistVerificationRow key={r.id || r._id} request={r} onApprove={handleApprove} onDecline={handleDecline} loading={approving || declining} />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page</span>
          <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }} className="border rounded px-2 py-1">
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Prev</Button>
          <span className="text-sm">Page {page} of {totalPages}</span>
          <Button size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Next</Button>
        </div>
      </div>
    </section>
  );
}
