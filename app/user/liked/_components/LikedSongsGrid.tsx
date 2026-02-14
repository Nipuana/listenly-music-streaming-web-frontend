import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, Shuffle, MoreHorizontal, Clock } from "lucide-react";
import { usePlayQueue } from "@/hooks/player-hooks/use-play-queue";
import { usePlayer } from "@/Providers/Contexts/player-context";
import { ConfirmPopup } from "./popup/ConfirmPopup";
import { LikedSongRow } from "./LikedSongRow";
import { toast } from "react-toastify";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export interface Song {
  id: string;
  _id?: string;
  title: string;
  artist: string;
  album?: string;
  createdAt?: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  audioUrl?: string;
  addedAt?: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; [key: string]: unknown };
}

interface LikedSongsGridProps {
  songs: Song[];
}

export function LikedSongsGrid({ songs }: LikedSongsGridProps) {
  const [localSongs, setLocalSongs] = useState(songs);
  useEffect(() => {
    setLocalSongs(songs);
  }, [songs]);

  const confirmActionRef = useRef<null | (() => void)>(null);
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
  });

  const openConfirm = useCallback(
    (options: { title: string; message: string; confirmLabel?: string; onConfirm: () => void }) => {
      confirmActionRef.current = options.onConfirm;
      setConfirmState({
        open: true,
        title: options.title,
        message: options.message,
        confirmLabel: options.confirmLabel || "Confirm",
      });
    },
    []
  );

  const handleConfirm = useCallback(() => {
    const action = confirmActionRef.current;
    confirmActionRef.current = null;
    setConfirmState({ open: false, title: "", message: "", confirmLabel: "Confirm" });
    action?.();
  }, []);

  const handleCancel = useCallback(() => {
    confirmActionRef.current = null;
    setConfirmState({ open: false, title: "", message: "", confirmLabel: "Confirm" });
  }, []);

  const handleUnlike = useCallback((songId: string) => {
    setLocalSongs((prev) => prev.filter((song) => song?.id !== songId));
    toast.info("Removed from liked songs");
  }, []);

  const availableSongs = useMemo(
    () => localSongs.filter((song) => Boolean(song?.id || song?._id) && Boolean(song?.audioUrl)),
    [localSongs]
  );
  const { playAll, playAtIndex, playShuffled } = usePlayQueue(availableSongs);
  const { isPlaying, currentSong, togglePlay } = usePlayer();
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(localSongs.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageSongs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return localSongs.slice(start, start + pageSize);
  }, [page, pageSize, localSongs]);

  const currentIndex = useMemo(() => {
    if (!currentSong) return -1;
    return availableSongs.findIndex((song) => (song.id || song._id) === currentSong.id);
  }, [availableSongs, currentSong]);

  const isPlayingLiked = isPlaying && currentIndex >= 0;

  const handlePlayAll = () => {
    if (isPlayingLiked) {
      togglePlay();
      return;
    }
    playAll();
  };

  const handleShuffle = () => {
    playShuffled();
  };


  return (
    <div className="bg-card/60 backdrop-blur-md border-border shadow-lg rounded-md overflow-hidden">
      <div className="p-6 border-b border-border bg-background-secondary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label={isPlayingLiked ? "Pause" : "Play"}
                  onClick={handlePlayAll}
                  className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center shadow-xl text-primary-foreground cursor-pointer"
                >
                  {isPlayingLiked ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{isPlayingLiked ? "Pause" : "Play all"}</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button aria-label="Shuffle" onClick={handleShuffle} className="text-foreground-muted hover:text-foreground cursor-pointer">
                  <Shuffle className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">Shuffle</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button aria-label="More" className="text-foreground-muted hover:text-foreground cursor-pointer">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">More options</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-3" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-180 table-fixed text-left">
          <thead className="bg-background-secondary">
            <tr className="text-foreground-muted text-sm">
              <th className="w-12 py-4 pl-4">#</th>
              <th className="py-4">Title</th>
                <th className="py-4">Artist Username</th>
              <th className="py-4">Date Added</th>
              <th className="w-24 py-4 pr-6 text-right"><Clock className="inline w-4 h-4 mr-1 align-middle" /></th>
              <th className="w-28 py-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageSongs.map((song, idx) => {
              const absoluteIndex = (page - 1) * pageSize + idx;
              if (!song) return null;

              const songId = song?.id || song?._id || "";
              const isUnavailable = !songId || !song?.audioUrl;
              const playableIndex = availableSongs.findIndex((item) => (item.id || item._id) === songId);

              return (
                <LikedSongRow
                  key={song.id || `row-${idx}`}
                  song={song}
                  idx={absoluteIndex}
                  isUnavailable={isUnavailable}
                  onPlay={() => {
                    if (isUnavailable || playableIndex < 0) return;
                    playAtIndex(playableIndex);
                  }}
                  onUnlike={handleUnlike}
                  onRequestUnlike={(confirmAction) =>
                    openConfirm({
                      title: "Remove from liked songs",
                      message: "Are you sure you want to remove this song from your liked list?",
                      confirmLabel: "Unlike",
                      onConfirm: confirmAction,
                    })
                  }
                />
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border bg-background-secondary px-4 py-3 text-sm text-foreground-muted">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={page === 1}
            className="rounded-md border border-border px-3 py-1 text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-border px-3 py-1 text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <ConfirmPopup
        open={confirmState.open}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
