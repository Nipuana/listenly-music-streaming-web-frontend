import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMyPlaylists, removeFromMyPlaylistsCache } from "@/hooks/cashing-hooks/use-my-playlists";
import { refetchAllPlaylists, removeFromAllPlaylistsCache } from "@/hooks/cashing-hooks/use-all-playlists";
import { Skeleton } from "@/components/ui/skeleton";
import { CreatePlaylistPopup } from "../../_components/popups/CreatePlaylistPopup";
import { EditPlaylistPopup } from "../../_components/popups/EditPlaylistPopup";
import { useMemo, useState } from "react";
import { Plus, Music } from "lucide-react";
import { PlaylistCard } from "./my_playlist/PlaylistCard";
import { DeletePlaylistConfirmDialog } from "@/components/ui/delete-playlist-confirm-dialog";
import { deletePlaylist } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlists";
import { toast } from "react-toastify";

export function PlaylistGrid() {
  const { playlists, loading, error, refetch } = useMyPlaylists();
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);
  const [editPlaylistId, setEditPlaylistId] = useState<string | null>(null);
  const [deletePlaylistId, setDeletePlaylistId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  // Ensure playlists is an array before mapping
  const playlistsArray = Array.isArray(playlists) ? playlists : [];

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

  const handleEditPlaylist = (playlistId: string) => {
    setEditPlaylistId(playlistId);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    setDeletePlaylistId(playlistId);
  };

  const confirmDelete = async () => {
    if (!deletePlaylistId || isDeleting) return;
    const idToDelete = deletePlaylistId;

    setIsDeleting(true);

    // Optimistic UI update
    setDeletePlaylistId(null);
    removeFromMyPlaylistsCache(idToDelete);
    removeFromAllPlaylistsCache(idToDelete);

    try {
      await deletePlaylist(idToDelete);
      toast.success("Playlist deleted");
      await Promise.all([refetch(), refetchAllPlaylists()]);
    } catch (e: any) {
      toast.error(e?.message || "Failed to delete playlist");
      await Promise.all([refetch(), refetchAllPlaylists()]);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Music className="w-5 h-5" />
              Your Playlists
            </CardTitle>
            <Button onClick={() => setIsCreatePopupOpen(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid-responsive-auto">
              {Array.from({ length: 8 }).map((_, index) => (
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
              <p className="text-muted-foreground">Failed to load playlists</p>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
          ) : playlistsArray.length > 0 ? (
            <>
              <div className="grid-responsive-auto">
                {displayed.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onEdit={handleEditPlaylist}
                  onDelete={handleDeletePlaylist}
                  allowFavorite={false}
                />
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
            <div className="text-center py-12">
              <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No playlists yet</p>
              <Button onClick={() => setIsCreatePopupOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create your first playlist
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <CreatePlaylistPopup
        isOpen={isCreatePopupOpen}
        onClose={() => setIsCreatePopupOpen(false)}
        onSuccess={() => {
          void refetch();
          void refetchAllPlaylists();
        }}
      />

      <EditPlaylistPopup
        isOpen={!!editPlaylistId}
        playlistId={editPlaylistId}
        onClose={() => setEditPlaylistId(null)}
        onSuccess={() => {
          void refetch();
          void refetchAllPlaylists();
        }}
      />

      <DeletePlaylistConfirmDialog
        isOpen={!!deletePlaylistId}
        playlistName={playlistsArray.find((p: any) => p.id === deletePlaylistId)?.name}
        onClose={() => {
          if (isDeleting) return;
          setDeletePlaylistId(null);
        }}
        onConfirm={confirmDelete}
        isConfirming={isDeleting}
      />
    </>
  );
}