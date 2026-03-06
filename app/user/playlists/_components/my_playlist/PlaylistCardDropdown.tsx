"use client";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Share, Copy } from "lucide-react";

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

interface PlaylistCardDropdownProps {
  playlist: Playlist;
  onEdit?: (playlistId: string) => void;
  onDelete?: (playlistId: string) => void;
}

export function PlaylistCardDropdown({ playlist, onEdit, onDelete }: PlaylistCardDropdownProps) {
  const defer = (fn: () => void) => {
    // Ensure dropdown closes before triggering UI that needs focus/clicks (e.g., a modal).
    setTimeout(fn, 0);
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    const url = `${window.location.origin}/user/playlist/${playlist.id}`;
    navigator.clipboard.writeText(url);
    console.log("Share playlist:", playlist.id, url);
  };

  const handleCopyLink = () => {
    // TODO: Implement copy link functionality
    const url = `${window.location.origin}/user/playlist/${playlist.id}`;
    navigator.clipboard.writeText(url);
    console.log("Copy link:", url);
  };

  return (
    <div className="absolute top-2 left-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="sm"
            variant="secondary"
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white border-0 shadow-lg"
          >
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {onEdit && (
            <DropdownMenuItem
              onSelect={(e) => {
                e.stopPropagation();
                defer(() => onEdit(playlist.id));
              }}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit playlist
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={(e) => {
              e.stopPropagation();
              handleShare();
            }}
          >
            <Share className="w-4 h-4 mr-2" />
            Share playlist
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={(e) => {
              e.stopPropagation();
              handleCopyLink();
            }}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy link
          </DropdownMenuItem>
          {onDelete && (
            <DropdownMenuItem
              onSelect={(e) => {
                e.stopPropagation();
                defer(() => onDelete(playlist.id));
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete playlist
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}