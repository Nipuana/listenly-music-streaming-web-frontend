"use client";
import { useAuth } from "../../../../Providers/Contexts/auth-context";
import { SidebarLayout } from "../../../../components/layout/sidebar/SidebarLayout";
import { PlaylistGrid } from "./PlaylistGrid";
import { FavoritedPlaylistGrid } from "./FavoritedPlaylistGrid";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";
import { useAllPlaylists } from "@/hooks/cashing-hooks/use-all-playlists";
import { isPlaylistPublic } from "@/lib/utils/playlist-visibility";
import { Star } from "lucide-react";
import { usePlaylistFavoriteStatus } from "@/hooks/cashing-hooks/use-playlist-favorite-status";
import { isPlaylistOwnedByUser } from "@/lib/utils/playlist-ownership";

export function PlaylistsClient() {
  return (
    <SidebarLayout mode="user">
      <MainContent />
    </SidebarLayout>
  );
}

function MainContent() {
  const { user } = useAuth();

  return (
    <main className="overflow-auto min-h-screen">
      <motion.div
        className="app-container space-y-8 max-w-7xl mx-auto px-4 md:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">My Playlists</h1>
          <p className="text-muted-foreground">Create and manage your music playlists</p>
        </div>
        <PlaylistGrid />
        <FavoritedPlaylistGrid />
        <PublicPlaylistsBrowse user={user} />
      </motion.div>
    </main>
  );
}

function PublicPlaylistsBrowse({ user }: { user: any }) {
  const { playlists: allPlaylists, loading } = useAllPlaylists();
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const publicPlaylists = useMemo(() => {
    const arr = Array.isArray(allPlaylists) ? allPlaylists : [];
    return arr.filter(isPlaylistPublic);
  }, [allPlaylists]);

  const totalPages = useMemo(() => {
    if (!open) return 1;
    return Math.max(1, Math.ceil(publicPlaylists.length / itemsPerPage));
  }, [open, publicPlaylists.length]);

  const displayed = useMemo(() => {
    if (!open) return [];
    const start = (page - 1) * itemsPerPage;
    return publicPlaylists.slice(start, start + itemsPerPage);
  }, [open, page, publicPlaylists]);

  return (
    <div className="pt-2">
      {!open ? (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => {
              setOpen(true);
              setPage(1);
            }}
          >
            Show all playlists
          </Button>
        </div>
      ) : (
        <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle>All Playlists</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Hide
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="grid-responsive-auto">
                {Array.from({ length: 8 }).map((_, idx) => (
                  <Card key={idx} className="border-border/50">
                    <CardContent className="card-responsive">
                      <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : publicPlaylists.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No public playlists found
              </div>
            ) : (
              <>
                <div className="grid-responsive-auto">
                  {displayed.map((pl: any) => (
                    <PublicPlaylistCard key={pl.id} playlist={pl} user={user} />
                  ))}
                </div>

                {totalPages > 1 && (
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
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function PublicPlaylistCard({ playlist, user }: { playlist: any; user: any }) {
  const pid = playlist?.id || playlist?._id || "";
  const isOwned = isPlaylistOwnedByUser(playlist, user);
  const { isFavorited, loading: favLoading, toggleFavoriteStatus } = usePlaylistFavoriteStatus(pid);
  const cover = getPlaylistCoverUrl(playlist?.coverUrl || playlist?.coverImageUrl || "");

  return (
    <Link href={`/user/playlist/${pid}`} className="w-full">
      <Card className="group border-border/50 hover:shadow-primary transition-all cursor-pointer overflow-hidden card-responsive">
        <CardContent className="p-4">
          <div className="relative mb-3">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted group-hover:scale-105 transition-transform">
              <Image
                src={cover}
                alt={playlist?.name || "Playlist"}
                width={300}
                height={300}
                unoptimized={true}
                className="w-full h-full object-cover"
              />
            </div>

            {!isOwned && (
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
            )}
          </div>

          <div className="space-y-1">
            <h4 className="font-semibold truncate hover:text-primary transition-colors">
              {playlist?.name || "Untitled Playlist"}
            </h4>
            <p className="text-sm text-muted-foreground">
              {(playlist?.trackCount ?? playlist?.songCount ?? 0)} songs
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}