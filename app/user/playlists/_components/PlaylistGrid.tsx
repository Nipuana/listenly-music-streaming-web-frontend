import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMyPlaylists, refetchMyPlaylists } from "@/hooks/cashing-hooks/use-my-playlists";
import { Skeleton } from "@/components/ui/skeleton";
import { CreatePlaylistPopup } from "../../_components/popups/CreatePlaylistPopup";
import { useState } from "react";
import { Plus, Music } from "lucide-react";
import { PlaylistCard } from "./my_playlist/PlaylistCard";

export function PlaylistGrid() {
  const { playlists, loading, error, refetch } = useMyPlaylists();
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

  // Ensure playlists is an array before mapping
  const playlistsArray = Array.isArray(playlists) ? playlists : [];

  const handleEditPlaylist = (playlistId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit playlist:", playlistId);
  };

  const handleDeletePlaylist = (playlistId: string) => {
    // TODO: Implement delete functionality
    console.log("Delete playlist:", playlistId);
  };

  const handlePlayPlaylist = (playlist: any) => {
    // TODO: Implement playlist playback
    console.log("Play playlist:", playlist.id);
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
            <div className="grid-responsive-auto">
              {playlistsArray.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  playlist={playlist}
                  onEdit={handleEditPlaylist}
                  onDelete={handleDeletePlaylist}
                />
              ))}
            </div>
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
          refetch(); // Refetch in the current component
          refetchMyPlaylists(); // Also refetch globally for sidebar
        }}
      />
    </>
  );
}