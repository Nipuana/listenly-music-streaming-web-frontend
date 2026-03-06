"use client";

import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlaylistFavoriteStatus } from "@/hooks/cashing-hooks/use-playlist-favorite-status";

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

interface PlaylistCardActionsProps {
  playlist: Playlist;
  allowFavorite?: boolean;
}

export function PlaylistCardActions({ playlist, allowFavorite = true }: PlaylistCardActionsProps) {
  const { isFavorited, loading: favLoading, toggleFavoriteStatus } = usePlaylistFavoriteStatus(playlist.id);

  return (
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
      {allowFavorite && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              className={`w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white border-0 shadow-lg ${
                isFavorited ? "ring-2 ring-yellow-400/60" : ""
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavoriteStatus();
              }}
              disabled={favLoading}
              aria-label={isFavorited ? "Unfavorite" : "Favorite"}
            >
              <Star
                className={`w-4 h-4 transition-colors ${
                  isFavorited ? "text-yellow-400 fill-yellow-400" : "text-white"
                }`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">{isFavorited ? "Unfavorite" : "Favorite"}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}