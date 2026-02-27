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
import { useSongLikeStatus } from "@/hooks/cashing-hooks/use-song-like-status";
import { Button } from "@/components/ui/button";
import { Play, Plus, Music, Heart, HeartOff, Share2, MoreHorizontal, Clock, Pause } from "lucide-react";
import { AddSongPopup } from "./AddSongPopup";
import { RecommendedSection } from "./recommended/RecommendedSection";
import { SongDetailsPopup } from "@/app/user/_components/popups/SongDetailsPopup";
import { getSongById } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
// playlist UI is static currently; API hooks removed

interface Playlist {
  id: string;
  name: string;
  coverUrl?: string;
  coverImageUrl?: string; // backend sometimes uses this field
  songs?: Song[];
  description?: string;
  isPublic?: boolean;
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

  // update when parent hands us a new playlist (eg. paging)
  useEffect(() => {
    setLocalPlaylist(playlist);
    setSongs(playlist.songs || []);
  }, [playlist]);

 
  const rawCover =  localPlaylist.coverImageUrl || "";
  const coverUrl = rawCover ? getPlaylistCoverUrl(rawCover) : "";

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


  // row component so hooks remain in order
  const SongRow = ({ song, idx }: { song: Song; idx: number }) => {
    const sid = song.id || (song as any)._id || '';
    const isUnavailable = !sid || !song?.audioUrl;
    const playableIndex = songs.findIndex((s) => (s.id || (s as any)._id) === sid);
    const isCurrentSong = currentSong && currentSong.id === sid;
    const isCurrentPlaying = isCurrentSong && isPlaying;

    // local copy that may get enriched with full details
    const [detail, setDetail] = useState<Song>(song);
    useEffect(() => {
      if (sid && (!detail.uploadedBy && !detail.artist)) {
        getSongById(sid)
          .then((resp: any) => {
            const fetched = resp && typeof resp === 'object' ? resp.data || resp.song || resp : resp;
            if (fetched) setDetail({ ...detail, ...fetched });
          })
          .catch(() => {});
      }
    }, [sid, detail]);

    const { isLiked, toggleLikeStatus, loading: likeLoading } = useSongLikeStatus(sid);

    return (
      <tr
        key={sid || idx}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          handleSongDetailsOpen(detail);
        }}
        className={`group border-t border-border transition-colors cursor-pointer ${
          isUnavailable ? 'bg-background/30 text-foreground-muted' : 'hover:bg-background'
        }`}
      >
        <td className="py-4 pl-4 align-middle text-foreground-secondary">{idx + 1}</td>
        <td className="py-4 align-middle">
          <div className="flex items-center gap-4">
            <Image
              src={getSongCoverUrl(song.coverImageUrl)}
              alt={song.title || 'cover'}
              width={48}
              height={48}
              unoptimized={true}
              className={`w-12 h-12 rounded-md object-cover shadow-sm ${isUnavailable ? 'opacity-50 grayscale' : ''}`}
            />
            <div className="min-w-0">
              <div className="font-semibold text-foreground truncate">{song.title || 'Unavailable'}</div>
            </div>
          </div>
        </td>
        <td className="py-4 align-middle pr-6 text-right text-foreground-muted">{formatDuration(parseInt(song.duration) || 0)}</td>
        <td className="py-4 pr-6 text-right">
          <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isUnavailable) return;
                    if (isCurrentSong) {
                      togglePlay();
                    } else {
                      playAtIndex(playableIndex);
                    }
                  }}
                  disabled={isUnavailable}
                  className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-background-secondary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  aria-label={isCurrentPlaying ? 'Pause' : 'Play'}
                >
                  {isCurrentPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{isCurrentPlaying ? 'Pause' : 'Play'}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!sid) return;
                    toggleLikeStatus();
                  }}
                  disabled={isUnavailable || likeLoading}
                  className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-background-secondary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  aria-label={isLiked ? 'Unlike' : 'Like'}
                >
                  {isLiked ? <HeartOff className="h-4 w-4" /> : <Heart className="h-4 w-4" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{isLiked ? 'Unlike' : 'Like'}</TooltipContent>
            </Tooltip>
          </div>
        </td>
      </tr>
    );
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
                    {localPlaylist.isPublic ? 'Public Playlist' : 'Private'}
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
                <Button variant="outline" className="text-white">
                  <Heart className="w-4 h-4" /> Save
                </Button>
                <Button variant="outline" className="text-white">
                  <Share2 className="w-4 h-4" /> Share
                </Button>
                <Button variant="outline" className="text-white">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
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
                  <th className="w-28 py-4 pr-6 text-right"><Clock className="inline w-4 h-4 mr-1 align-middle" /></th>
                  <th className="w-28 py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song, idx) => (
                  <SongRow key={song.id || (song as any)._id || idx} song={song} idx={idx} />
                ))}
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
          existingSongIds={songs.map(s => s.id || (s as any)._id || "")}
          onAdd={(song) => setSongs((prev) => [...prev, song])}
        />
      </div>
    </div>
  );
}
