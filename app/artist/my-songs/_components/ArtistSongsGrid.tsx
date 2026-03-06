"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ArtistSongRow from "./ArtistSongRow";
import { deleteSong } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
import EditSongPopup from "@/app/artist/_components/popups/EditSongPopup";
import { Pause, Play, Shuffle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { usePlayer } from "@/Providers/Contexts/player-context";
import { usePlayQueue } from "@/hooks/player-hooks/use-play-queue";

interface ArtistSongsGridProps {
  songs: any[];
  onAdd?: () => void;
}

export default function ArtistSongsGrid({ songs, onAdd, onRefresh }: ArtistSongsGridProps & { onRefresh?: () => Promise<void> }) {
  const [editing, setEditing] = useState<any | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const availableSongs = useMemo(
    () => songs.filter((song) => Boolean(song?.id || song?._id) && Boolean(song?.audioUrl)),
    [songs]
  );

  const { playAtIndex, playAll, playShuffled } = usePlayQueue(availableSongs);
  const { isPlaying, currentSong, togglePlay } = usePlayer();

  const currentIndex = useMemo(() => {
    if (!currentSong) return -1;
    return availableSongs.findIndex((s) => (s.id || (s as any)._id) === currentSong.id);
  }, [availableSongs, currentSong]);

  const isPlayingList = isPlaying && currentIndex >= 0;

  return (
    <div className="w-full bg-card/60 backdrop-blur-md border-border shadow-lg rounded-md overflow-hidden">
      <div className="p-6 border-b border-border bg-background-secondary flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label={isPlayingList ? "Pause" : "Play"}
                onClick={() => {
                  if (isPlayingList) togglePlay();
                  else playAll();
                }}
                className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-xl text-primary-foreground cursor-pointer"
              >
                {isPlayingList ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{isPlayingList ? "Pause" : "Play all"}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button aria-label="Shuffle" onClick={() => playShuffled()} className="text-foreground-muted hover:text-foreground cursor-pointer">
                <Shuffle className="w-5 h-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Shuffle</TooltipContent>
          </Tooltip>

          <div>
            <h2 className="text-lg font-semibold">My Songs</h2>
            <p className="text-sm text-foreground-muted">All uploaded songs by you</p>
          </div>
        </div>

        <div>
          {onAdd && (
            <Button onClick={onAdd} variant="default" size="sm">
              <Plus className="w-4 h-4 mr-2" /> Add New Song
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto p-6">
        <table className="w-full min-w-180 table-fixed text-left">
          <thead className="bg-background-secondary">
            <tr className="text-foreground-muted text-sm">
              <th className="w-12 py-4 pl-4">#</th>
              <th className="py-4">Title</th>
              <th className="py-4">Date Added</th>
              <th className="w-24 py-4 pr-6 text-right">Duration</th>
              <th className="w-28 py-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song, idx) => {
              const songId = song?.id || song?._id || "";
              const isUnavailable = !songId || !song?.audioUrl;
              const playableIndex = availableSongs.findIndex((item) => (item.id || item._id) === songId);

              return (
                <ArtistSongRow
                  key={song.id || song._id || idx}
                  song={song}
                  idx={idx}
                  isUnavailable={isUnavailable}
                  onPlay={() => {
                    if (isUnavailable || playableIndex < 0) return;
                    playAtIndex(playableIndex);
                  }}
                  onEdit={() => {
                    setEditing(song);
                    setIsEditOpen(true);
                  }}
                  onDelete={async () => {
                    const ok = confirm("Delete this song?");
                    if (!ok) return;
                    try {
                      await deleteSong(song.id || song._id);
                      await onRefresh?.();
                    } catch (err) {
                      console.error("Failed to delete song", err);
                    }
                  }}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <EditSongPopup
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditing(null);
        }}
        song={editing}
        onSuccess={async () => {
          await onRefresh?.();
        }}
      />
    </div>
  );
}
