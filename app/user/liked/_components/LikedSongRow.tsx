import { useEffect, useMemo, useRef } from "react";
import { HeartOff, Pause, Play } from "lucide-react";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";
import { useArtistProfile } from "@/hooks/artist-hooks/use-artist-profile";
import { usePlayer } from "@/Providers/Contexts/player-context";
import { useSongLikeStatus } from "@/hooks/cashing-hooks/use-song-like-status";
import { formatDuration, formatRelativeTime } from "../utils/formatting-utils";
import type { Song } from "../utils/handlers";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface LikedSongRowProps {
  song: Song;
  idx: number;
  onPlay: () => void;
  onRequestUnlike: (confirmAction: () => void) => void;
  onUnlike: (songId: string) => void;
  isUnavailable: boolean;
  onRowClick?: () => void;
}

export function LikedSongRow({
  song,
  idx,
  onPlay,
  onRequestUnlike,
  onUnlike,
  isUnavailable,
  onRowClick,
}: LikedSongRowProps) {
  let userId: string | undefined;
  if (typeof song.uploadedBy === "string") userId = song.uploadedBy;
  else if (song.uploadedBy && typeof song.uploadedBy === "object") {
    userId = (song.uploadedBy as any)._id || (song.uploadedBy as any).id;
  }

  const { name: artistName, loading: artistLoading } = useArtistProfile(userId);

  const displayName = useMemo(() => {
    if (artistLoading === false && artistName) return artistName;
    if (typeof song.uploadedBy === "string") return song.uploadedBy;
    if (song.uploadedBy && typeof song.uploadedBy === "object") {
      const u = song.uploadedBy as any;
      return u.username || u.name || u._id || u.id || song.artist || "—";
    }
    return song.artist || "—";
  }, [artistLoading, artistName, song.artist, song.uploadedBy]);

  const { isPlaying, currentSong, togglePlay } = usePlayer();
  const safeSongId = song.id || (song as any)._id || "";
  const { isLiked, toggleLikeStatus, loading: likeLoading } = useSongLikeStatus(safeSongId);
  const isCurrentSong = Boolean(currentSong && currentSong.id === song.id);
  const isCurrentPlaying = isCurrentSong && isPlaying;
  const wasLikedRef = useRef(isLiked);

  const handlePlayClick = () => {
    if (isUnavailable) return;
    if (isCurrentSong) {
      togglePlay();
      return;
    }
    onPlay();
  };

  useEffect(() => {
    if (!isUnavailable && wasLikedRef.current && !isLiked) {
      onUnlike(song.id);
    }
    wasLikedRef.current = isLiked;
  }, [isLiked, isUnavailable, onUnlike, song.id]);

  return (
    <tr
      className={`group border-t border-border transition-colors cursor-pointer ${
        isUnavailable ? "bg-background/30 text-foreground-muted" : "hover:bg-background"
      }`}
      onClick={onRowClick}
    >
      <td className="py-4 pl-4 align-middle text-foreground-secondary">{idx + 1}</td>
      <td className="py-4 align-middle">
        <div className="flex items-center gap-4">
          <img
            src={getSongCoverUrl(song.coverImageUrl)}
            alt={song.title || "cover"}
            className={`w-12 h-12 rounded-md object-cover shadow-sm ${
              isUnavailable ? "opacity-50 grayscale" : ""
            }`}
          />
          <div className="min-w-0">
            <div className="font-semibold text-foreground truncate">
              {song.title || "Unavailable"}
            </div>
            <div className="text-sm text-foreground-muted truncate">
              {isUnavailable ? "This track is no longer available" : song.artist}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 align-middle text-foreground">{displayName}</td>
      <td className="py-4 align-middle text-foreground-muted">
        {formatRelativeTime(song.createdAt)}
      </td>
      <td className="py-4 align-middle pr-6 text-right text-foreground-muted">
        {formatDuration(parseInt(song.duration) || 0)}
      </td>
      <td className="py-4 pr-6 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handlePlayClick}
                disabled={isUnavailable}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-background-secondary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                aria-label={isCurrentPlaying ? "Pause" : "Play"}
              >
                {isCurrentPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">{isCurrentPlaying ? "Pause" : "Play"}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  if (!safeSongId) return;
                  onRequestUnlike(() => toggleLikeStatus());
                }}
                disabled={isUnavailable || likeLoading}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground hover:bg-background-secondary disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                aria-label="Unlike"
              >
                <HeartOff className="h-4 w-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top">Unlike</TooltipContent>
          </Tooltip>
        </div>
      </td>
    </tr>
  );
}
