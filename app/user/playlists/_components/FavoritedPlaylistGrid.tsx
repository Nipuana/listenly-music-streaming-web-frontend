"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { PlaylistCard } from "./my_playlist/PlaylistCard";
import { useFavoritedPlaylists } from "@/hooks/cashing-hooks/use-favorited-playlists";
import { useMemo, useState } from "react";

export function FavoritedPlaylistGrid() {
  const { playlists, loading, error } = useFavoritedPlaylists();
  const playlistsArray = Array.isArray(playlists) ? playlists : [];

  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const totalItems = playlistsArray.length;
  const totalPages = useMemo(() => {
    if (!expanded) return 1;
    return Math.max(1, Math.ceil(totalItems / itemsPerPage));
  }, [expanded, totalItems]);

  const displayed = useMemo(() => {
    if (!expanded) return playlistsArray.slice(0, 3);
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return playlistsArray.slice(start, end);
  }, [expanded, page, playlistsArray]);

  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          Favorited Playlists
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="grid-responsive-auto">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="card-responsive">
                  <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load favorited playlists</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        ) : playlistsArray.length > 0 ? (
          <>
            <div className="grid-responsive-auto">
              {displayed.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
              ))}
            </div>

            {!expanded && totalItems > 3 && (
              <div className="flex justify-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setExpanded(true);
                    setPage(1);
                  }}
                >
                  Show more
                </Button>
              </div>
            )}

            {expanded && totalPages > 1 && (
              <div className="flex items-center justify-center mt-6 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No favorited playlists yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
