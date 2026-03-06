"use client";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { getFullImageUrl } from "@/lib/utils/image-util";
import { useArtistInfo } from "@/hooks/artist-hooks/use-artist-info";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { resolveAdminNote, getMessage } from "./utils/helpers";
import { UserAvatar } from "@/components/ui/user-avatar";

export interface ArtistRequestRowProps {
  request: any;
  onApprove: (id: string, note?: string) => Promise<unknown> | unknown;
  onDecline: (id: string, note?: string) => Promise<unknown> | unknown;
  loading?: boolean;
}

export default function ArtistVerificationRow({ request, onApprove, onDecline, loading = false }: ArtistRequestRowProps) {
  const id = request.id ?? request._id;
  // Try to determine the requester id from common fields on the request
  const candidateId =
    request.user?.userId || request.user?._id || request.userId || request.requesterId || request.user_id || request.requester || request.requester_id || null;

  const { artist: fetchedArtist } = useArtistInfo(candidateId ?? undefined);

  const user = fetchedArtist ?? request.user ?? {};
  const name =
    user.name || request.name || user.username || user.userName || user.fullName || user.email?.split("@")[0] || "Unknown";
  const createdAt = request.createdAt ? new Date(request.createdAt) : null;
  const status: string = request.status ?? "pending";
  const disabled = status !== "pending" || loading;

  const [note, setNote] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const adminNoteValue = resolveAdminNote(request);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <tr className="border-t hover:bg-card/25 transition-colors">
          <td className="p-3 align-middle w-1/2">
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSheetOpen(true); } }}
              onClick={(e) => { e.stopPropagation(); setSheetOpen(true); }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <UserAvatar name={name} profilePicUrl={user.profilePicture || user.avatar} size="sm" className="w-9 h-9" fallbackClassName="text-sm font-bold" />
              <div>
                <div className="font-medium text-foreground">{name}</div>
                <div className="text-sm text-muted-foreground">{user.email ?? request.email ?? ""}</div>
              </div>
            </div>
          </td>
          <td className="p-3 align-middle text-sm text-muted-foreground w-1/6">{createdAt ? formatDistanceToNow(createdAt, { addSuffix: true }) : "-"}</td>
          <td className="p-3 align-middle w-1/6">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status === 'approved' ? 'bg-green-100 text-green-800' : status === 'declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {status}
        </span>
          </td>
          <td className="p-3 align-middle w-1/6">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" disabled={disabled} onClick={(e) => e.stopPropagation()}>Approve</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" onClick={(e) => e.stopPropagation()}>
                  <div className="p-2">
                    <Input placeholder="adminNote" value={note} onChange={(e) => { e.stopPropagation(); setNote(e.target.value); }} />
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" onClick={(e) => { e.stopPropagation(); onApprove(String(id), note || undefined); setNote(""); }} disabled={disabled}>Confirm</Button>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setNote(""); }}>Cancel</Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="destructive" disabled={disabled} onClick={(e) => e.stopPropagation()}>Decline</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" onClick={(e) => e.stopPropagation()}>
                  <div className="p-2">
                    <Input placeholder="adminNote" value={note} onChange={(e) => { e.stopPropagation(); setNote(e.target.value); }} />
                    <div className="mt-2 flex gap-2">
                      <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); onDecline(String(id), note || undefined); setNote(""); }} disabled={disabled}>Confirm</Button>
                      <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setNote(""); }}>Cancel</Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </td>
        </tr>

      <SheetContent side="right">
        <SheetHeader>
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <UserAvatar name={name} profilePicUrl={user.profilePicture || user.avatar} size="lg" className="w-12 h-12" fallbackClassName="text-sm font-bold" />
              <div>
                <SheetTitle className="text-lg">{name}</SheetTitle>
                <SheetDescription className="text-sm">{user.email ?? request.email ?? ""}</SheetDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="mb-1"><span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status === 'approved' ? 'bg-green-100 text-green-800' : status === 'declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{status}</span></div>
              <div className="text-xs text-muted-foreground">{createdAt ? formatDistanceToNow(createdAt, { addSuffix: true }) : "-"}</div>
            </div>
          </div>
        </SheetHeader>

        <div className="p-4 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Message</h4>
            <div className="mt-2 rounded-md border border-border bg-muted p-3 text-sm text-foreground max-h-40 overflow-auto">{String(getMessage(request))}</div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground">Admin Note</h4>
            {status !== "pending" ? (
              <div className="mt-2 rounded-md border border-border bg-muted p-3 text-sm text-foreground">{String(adminNoteValue || "-")}</div>
            ) : (
              <Input className="mt-2" placeholder="Leave an admin note (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
            )}
          </div>
        </div>

        <SheetFooter>
          {status === "pending" ? (
            <div className="flex gap-2">
              <Button onClick={() => { onApprove(String(id), note || undefined); setSheetOpen(false); setNote(""); }} disabled={loading}>Approve</Button>
              <Button variant="destructive" onClick={() => { onDecline(String(id), note || undefined); setSheetOpen(false); setNote(""); }} disabled={loading}>Decline</Button>
              <SheetClose asChild>
                <Button variant="ghost">Close</Button>
              </SheetClose>
            </div>
          ) : (
            <div className="flex gap-2">
              <SheetClose asChild>
                <Button variant="ghost">Close</Button>
              </SheetClose>
            </div>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
