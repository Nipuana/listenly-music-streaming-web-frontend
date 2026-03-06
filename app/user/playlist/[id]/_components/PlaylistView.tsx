"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";
import { formatDuration } from "@/app/user/liked/utils/formatting-utils";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Song } from "@/app/user/liked/utils/handlers";
import { usePlayQueue } from "@/hooks/player-hooks/use-play-queue";
import { usePlayer } from "@/Providers/Contexts/player-context";
import { Button } from "@/components/ui/button";
import { Play, Plus, Music, Star, StarOff, Share2, MoreHorizontal, Clock, Pause, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { usePlaylistFavoriteStatus } from "@/hooks/cashing-hooks/use-playlist-favorite-status";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { isPlaylistOwnedByUser } from "@/lib/utils/playlist-ownership";
import { AddSongPopup } from "./AddSongPopup";
import { RecommendedSection } from "./recommended/RecommendedSection";
import { SongDetailsPopup } from "@/app/user/_components/popups/SongDetailsPopup";
import { getSongById } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
import { EditPlaylistPopup } from "@/app/user/_components/popups/EditPlaylistPopup";
import { DeletePlaylistConfirmDialog } from "@/components/ui/delete-playlist-confirm-dialog";
import { deletePlaylist, getPlaylistById } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlists";
import { PlaylistSongRow } from "./PlaylistSongRow";


interface Playlist {
  id: string;
  _id?: string;
  name: string;
  coverUrl?: string;
  coverImageUrl?: string;
  songs?: Song[];
  description?: string;
  isPublic?: boolean;
  isPrivate?: boolean;
  visibility?: string;
  creator?: string;
  duration?: string;
  followersCount?: number;
  followers?: number;
}

interface PlaylistViewProps {
  playlist: Playlist;
  showHeader?: boolean;
}

export default function PlaylistView({ playlist, showHeader = true }: PlaylistViewProps) {
  const [localPlaylist, setLocalPlaylist] = useState<Playlist>(playlist);
  const [songs, setSongs] = useState<Song[]>(playlist.songs || []);
  const { user } = useAuth();

  // update when parent hands us a new playlist (eg. paging)
  useEffect(() => {
    setLocalPlaylist(playlist);
    setSongs(playlist.songs || []);
  }, [playlist]);

 
  const rawCover =
    localPlaylist.coverImageUrl ||
    localPlaylist.coverUrl ||
    (localPlaylist as any).coverImage ||
    (localPlaylist as any).coverImagePath ||
    "";
  const coverUrl = rawCover ? getPlaylistCoverUrl(rawCover) : "";

  const isPublicPlaylist = useMemo(() => {
    const p: any = localPlaylist;

    if (typeof p?.isPublic === "boolean") return p.isPublic;
    if (typeof p?.isPrivate === "boolean") return !p.isPrivate;
    if (typeof p?.private === "boolean") return !p.private;
    if (typeof p?.public === "boolean") return p.public;

    if (typeof p?.isPublic === "string") {
      const v = p.isPublic.toLowerCase();
      if (v === "true") return true;
      if (v === "false") return false;
    }

    const visibility = (p?.visibility || p?.privacy || p?.access || "").toString().toLowerCase();
    if (visibility) return visibility === "public";

    return false;
  }, [localPlaylist]);

  const { playAll, playAtIndex } = usePlayQueue(songs);

  const totalDurationMs = useMemo(() => songs.reduce((acc, s) => acc + (parseInt(s.duration) || 0), 0), [songs]);
  const formattedTotalDuration = formatDuration(totalDurationMs);
  const followersCount = playlist.followersCount || playlist.followers || 0;
  const hasFollowers = followersCount > 0;

  const [addOpen, setAddOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isSongDetailsOpen, setIsSongDetailsOpen] = useState(false);
  const { isPlaying, currentSong, togglePlay } = usePlayer();
  const currentIndex = useMemo(() => {
    if (!currentSong) return -1;
    return songs.findIndex((s) => (s.id || (s as any)._id) === currentSong.id);
  }, [songs, currentSong]);
  const isPlayingPlaylist = isPlaying && currentIndex >= 0;

  const safePlaylistId = (playlist as any)?.id || (playlist as any)?._id || "";
  const { isFavorited, loading: favLoading, toggleFavoriteStatus } = usePlaylistFavoriteStatus(safePlaylistId);
  const isOwned = useMemo(() => isPlaylistOwnedByUser(localPlaylist, user), [localPlaylist, user]);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleSongDetailsOpen = async (song: Song | string) => {
    let songId = typeof song === 'string' ? song : song.id || (song as any)._id || '';
    if (!songId) return;

    let songObj: Song | null = songs.find(s => (s.id || (s as any)._id) === songId) || null;

    try {
      const resp: any = await getSongById(songId);
      const fetched = resp && typeof resp === 'object' ? resp.data || resp.song || resp : resp;
      if (fetched) songObj = fetched;
    } catch (e) {
      console.error('failed to fetch song by id', e);
    }

    if (songObj) {
      setSelectedSong(songObj);
      setIsSongDetailsOpen(true);
    }
  };
  const handleSongDetailsClose = () => {
    setIsSongDetailsOpen(false);
    setSelectedSong(null);
  };


  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* gradient header */}
      {showHeader && (
        <div className="relative bg-linear-to-r from-primary to-secondary text-white rounded-b-3xl pb-12">
          <div className="max-w-7xl mx-auto px-6 pt-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {coverUrl && (
                <div className="w-48 h-48 rounded-lg overflow-hidden shadow-lg shrink-0">
                  <Image
                    src={coverUrl}
                    alt={playlist.name || "playlist"}
                    width={192}
                    height={192}
                    unoptimized={true}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase bg-white/20 px-2 py-1 rounded-full">
                    {isPublicPlaylist ? 'Public Playlist' : 'Private'}
                  </span>
                </div>
                <h1 className="text-5xl font-bold leading-tight truncate">
                  {playlist.name || "Untitled Playlist"}
                </h1>
                {localPlaylist.description && (
                  <p className="mt-2 text-lg opacity-90">
                    {localPlaylist.description}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm opacity-90">
                  {localPlaylist.creator && (
                    <span className="flex items-center gap-1">
                      <Music className="w-4 h-4" /> {localPlaylist.creator}
                    </span>
                  )}
                  {hasFollowers && (
                    <span>• {followersCount.toLocaleString()} followers</span>
                  )}
                  <span>• {songs.length} song{songs.length === 1 ? '' : 's'}</span>
                  <span>• {formattedTotalDuration}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
                <Button
                  onClick={() => {
                    if (isPlayingPlaylist) togglePlay();
                    else playAll();
                  }}
                  className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 hover:text-primary transition"
                >
                  <Play className="w-4 h-4" />
                  {isPlayingPlaylist ? "Pause" : "Play All"}
                </Button>
                <Button
                  onClick={() => setAddOpen(true)}
                  className="flex items-center gap-2 bg-white text-primary hover:bg-white/90 hover:text-primary transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Songs
                </Button>
                {/* placeholder icons for save/share/more */}
                {!isOwned && (
                  <Button
                    variant="outline"
                    className="text-white"
                    onClick={() => toggleFavoriteStatus()}
                    disabled={favLoading || !safePlaylistId}
                  >
                    {isFavorited ? (
                      <StarOff className="w-4 h-4 text-yellow-400" />
                    ) : (
                      <Star className="w-4 h-4 text-yellow-400" />
                    )}
                    {isFavorited ? "Unfavorite" : "Favorite"}
                  </Button>
                )}

                {isOwned ? (
                  <>
                    <Button
                      variant="outline"
                      className="text-white"
                      onClick={() => setEditOpen(true)}
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="text-white"
                      onClick={() => setDeleteOpen(true)}
                    >
                      Delete
                    </Button>
                  </>
                ) : (
                  // not owned: hide share/edit buttons (keep favorite)
                  null
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {/* song table */}
        <div className="bg-card/60 backdrop-blur-md border-border shadow-lg rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 table-fixed text-left">
              <thead className="bg-background-secondary">
                <tr className="text-foreground-muted text-sm">
                  <th className="w-12 py-4 pl-4">#</th>
                  <th className="py-4">Title</th>
                  <th className="py-4">Artist</th>
                  <th className="py-4">Date Added</th>
                  <th className="w-24 py-4 pr-6 text-right"><Clock className="inline w-4 h-4 mr-1 align-middle" /></th>
                  <th className="w-28 py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, idx) => {
                  const songId = song.id || (song as any)._id || "";
                  const isUnavailable = !songId || !song?.audioUrl;
                  const playableIndex = songs.findIndex((s) => (s.id || (s as any)._id) === songId);

                  return (
                    <PlaylistSongRow
                      key={songId || idx}
                      song={song}
                      idx={idx}
                      isUnavailable={isUnavailable}
                      onPlay={() => {
                        if (isUnavailable) return;
                        if (playableIndex >= 0) playAtIndex(playableIndex);
                      }}
                      onRowClick={() => handleSongDetailsOpen(song)}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommended songs */}
        <RecommendedSection />

        <SongDetailsPopup
          song={selectedSong}
          isOpen={isSongDetailsOpen}
          onClose={handleSongDetailsClose}
          onPlay={() => {
            if (!selectedSong) return;
            const songId = selectedSong.id || (selectedSong as any)._id;
            const index = songs.findIndex(s => (s.id || (s as any)._id) === songId);
            if (index >= 0) playAtIndex(index);
          }}
        />

        <AddSongPopup
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
          playlistId={playlist.id}
          playlistName={playlist.name}
          existingSongIds={songs.map(s => s.id || (s as any)._id || "")}
          onAdd={(song) => setSongs((prev) => [...prev, song])}
        />
        <EditPlaylistPopup
          isOpen={editOpen}
          playlistId={safePlaylistId || null}
          onClose={() => setEditOpen(false)}
          onSuccess={async () => {
            try {
              const resp: any = await getPlaylistById(safePlaylistId);
              const refreshed = resp && typeof resp === "object" ? resp.data || resp.playlist || resp : resp;
              if (refreshed) {
                setLocalPlaylist(refreshed);
                setSongs(refreshed.songs || []);
              }
            } catch (e) {
              // ignore
            }
          }}
        />

        <DeletePlaylistConfirmDialog
          isOpen={deleteOpen}
          playlistName={playlist.name}
          onClose={() => setDeleteOpen(false)}
          onConfirm={async () => {
            if (!safePlaylistId) return;
            setIsDeleting(true);
            try {
              await deletePlaylist(safePlaylistId);
              toast.success("Playlist deleted");
              router.push("/user/playlists");
            } catch (e: any) {
              toast.error(e?.message || "Failed to delete playlist");
            } finally {
              setIsDeleting(false);
              setDeleteOpen(false);
            }
          }}
          isConfirming={isDeleting}
        />
      </div>
    </div>
  );
}
