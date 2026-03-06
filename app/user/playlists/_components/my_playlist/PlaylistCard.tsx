"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";
import { PlaylistCardActions } from "./PlaylistCardActions";
import { PlaylistCardDropdown } from "./PlaylistCardDropdown";
import { Music } from "lucide-react";

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit?: (playlistId: string) => void;
  onDelete?: (playlistId: string) => void;
  allowFavorite?: boolean;
}

export function PlaylistCard({ playlist, onEdit, onDelete, allowFavorite = true }: PlaylistCardProps) {
  return (
    <Card className="group border-border/50 hover:shadow-primary transition-all cursor-pointer overflow-hidden card-responsive">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <Link href={`/user/playlist/${playlist.id}`}>
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted group-hover:scale-105 transition-transform">
              <Image
                src={getPlaylistCoverUrl(playlist.coverUrl)}
                alt={playlist.name}
                width={300}
                height={300}
                unoptimized={true}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          <PlaylistCardActions
            playlist={playlist}
            allowFavorite={allowFavorite}
          />

          <PlaylistCardDropdown
            playlist={playlist}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>

        <Link href={`/user/playlist/${playlist.id}`}>
          <div className="space-y-1">
            <h4 className="font-semibold truncate hover:text-primary transition-colors">
              {playlist.name}
            </h4>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Music className="w-3 h-3" />
              {playlist.trackCount} songs
            </p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}