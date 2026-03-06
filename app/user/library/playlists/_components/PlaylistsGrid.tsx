"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";
import { usePlaylistFavoriteStatus } from "@/hooks/cashing-hooks/use-playlist-favorite-status";
import { Star } from "lucide-react";
import { isPlaylistPublic } from "@/lib/utils/playlist-visibility";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { isPlaylistOwnedByUser } from "@/lib/utils/playlist-ownership";

interface Playlist {
  id: string;
  _id?: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

interface PlaylistsGridProps {
  playlists: Playlist[];
}

export function PlaylistsGrid({ playlists }: PlaylistsGridProps) {
  return (
    <Card className="bg-card backdrop-blur-md border-border shadow-lg">
      <CardHeader className="bg-background-secondary border-b border-border">
        <CardTitle className="text-foreground font-bold text-xl">
          Playlists
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="grid-responsive-auto justify-items-center sm:justify-items-start">
          {playlists
            .filter((playlist) => playlist && (playlist.id || playlist._id) && isPlaylistPublic(playlist))
            .map((playlist) => {
              const pid = playlist.id || playlist._id;
              return (
                <LibraryPlaylistCard key={pid} playlist={playlist} />
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

function LibraryPlaylistCard({ playlist }: { playlist: Playlist }) {
  const pid = playlist.id || playlist._id || "";
  const { user } = useAuth();
  const isOwned = isPlaylistOwnedByUser(playlist, user);
  const { isFavorited, loading: favLoading, toggleFavoriteStatus } = usePlaylistFavoriteStatus(pid);
  const cover = getPlaylistCoverUrl((playlist as any).coverUrl || (playlist as any).coverImageUrl);

  return (
    <Link href={`/user/playlist/${pid}`} className="w-full max-w-80">
      <Card className="border-border bg-background-secondary hover:shadow-shadow-primary transition-all cursor-pointer group overflow-hidden w-full">
        <CardContent className="p-4">
          <div className="relative">
            <Image
              src={cover}
              alt={playlist.name}
              width={300}
              height={300}
              unoptimized={true}
              className="w-full aspect-square rounded-xl shadow-md mb-4 group-hover:scale-105 transition-transform duration-300"
            />

            {!isOwned && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className={`absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-black/60 hover:bg-black/80 text-white border-0 h-10 w-10 ${
                      isFavorited ? "ring-2 ring-yellow-400/60" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavoriteStatus();
                    }}
                    disabled={favLoading || !pid}
                    aria-label={isFavorited ? "Unfavorite" : "Favorite"}
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        isFavorited ? "text-yellow-400 fill-yellow-400" : "text-white"
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">{isFavorited ? "Unfavorite" : "Favorite"}</TooltipContent>
              </Tooltip>
            )}
          </div>

          <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            {playlist.name}
          </h3>
          <p className="text-xs text-foreground-muted font-medium">
            {playlist.trackCount} tracks
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}