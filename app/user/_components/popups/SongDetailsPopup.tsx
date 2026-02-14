"use client";

import { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Play, Pause, Calendar, User, Clock, X } from "lucide-react";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";
import { useArtistProfile } from "@/hooks/artist-hooks/use-artist-profile";
import { usePlayer } from "@/Providers/Contexts/player-context";
import { formatDuration, formatRelativeTime } from "../../liked/utils/utils";
import { getFullImageUrl } from "@/lib/utils/image-util";
import { ArtistProfilePopup } from "./ArtistProfilePopup";
import { Slider } from "@/components/ui/slider";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  audioUrl?: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; [key: string]: unknown };
  createdAt?: string;
}

interface SongDetailsPopupProps {
  song: Song | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: () => void;
}

export function SongDetailsPopup({ song, isOpen, onClose, onPlay }: SongDetailsPopupProps) {
  const { isPlaying, currentSong, togglePlay, currentTime, duration, seekTo } = usePlayer();
  const [isArtistPopupOpen, setIsArtistPopupOpen] = useState(false);

  const formatTime = (time: number) => {
    if (!Number.isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Extract user ID from uploadedBy field
  const userId = useMemo(() => {
    if (!song) return '';
    if (typeof song.uploadedBy === 'object' && song.uploadedBy !== null) {
      return song.uploadedBy._id || song.uploadedBy.id || '';
    }
    return song.uploadedBy || '';
  }, [song]);

  const { name: artistName, profilePicSrc, profilePicFallback, loading: artistLoading } = useArtistProfile(userId || undefined);

  const displayName = useMemo(() => {
    if (artistLoading === false && artistName) return artistName;
    if (typeof song?.uploadedBy === "string") return song.uploadedBy;
    if (song?.uploadedBy && typeof song.uploadedBy === "object") {
      const u = song.uploadedBy as any;
      return u.username || u.name || u._id || u.id || song.artist || "—";
    }
    return song?.artist || "—";
  }, [artistLoading, artistName, song]);

  const isCurrentSong = Boolean(currentSong && currentSong.id === song?.id);
  const isCurrentPlaying = isCurrentSong && isPlaying;

  const handlePlayClick = () => {
    if (isCurrentSong) {
      togglePlay();
    } else {
      onPlay();
    }
  };

  if (!song) return null;

  const modalContent = (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          />

          {/* Modal Content */}
          <div className="relative bg-background rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="p-6">
              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  {song.title}
                </h2>
              </div>

              {/* Large Cover Image */}
              <div className="flex justify-center mb-6">
                <img
                  src={getSongCoverUrl(song.coverImageUrl)}
                  alt={song.title || 'Song cover'}
                  className="w-80 h-80 rounded-xl shadow-2xl object-cover"
                />
              </div>

              {/* Play Controls */}
              <div className="flex justify-center mb-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayClick();
                  }}
                  className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center shadow-xl text-primary-foreground cursor-pointer hover:scale-105 transition-transform"
                  aria-label={isCurrentPlaying ? "Pause" : "Play"}
                >
                  {isCurrentPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8" />
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 text-xs text-foreground-muted">
                  {isCurrentSong ? formatTime(currentTime) : formatTime(0)}
                </span>
                <Slider
                  value={[isCurrentSong ? Math.min(currentTime, duration || 0) : 0]}
                  min={0}
                  max={isCurrentSong ? (duration || 0) : (song?.duration ? parseInt(song.duration) : 0)}
                  step={1}
                  onValueChange={isCurrentSong ? ((value) => seekTo(value[0] || 0)) : undefined}
                  disabled={!isCurrentSong}
                  className="flex-1"
                />
                <span className="w-12 text-xs text-foreground-muted">
                  {isCurrentSong ? formatTime(duration) : formatTime(song?.duration ? parseInt(song.duration) : 0)}
                </span>
              </div>

              {/* Song Details */}
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">
                    {song.genre}
                  </p>
                </div>

                {/* Artist Information */}
                <div
                  className="flex items-center justify-center gap-3 p-4 bg-muted/60 rounded-lg cursor-pointer border border-border/60 shadow-sm transition-all hover:bg-muted hover:border-border hover:shadow-md hover:ring-1 hover:ring-primary/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsArtistPopupOpen(true);
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg font-bold overflow-hidden shrink-0">
                    {profilePicSrc ? (
                      <img
                        src={getFullImageUrl(profilePicSrc) || undefined}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profilePicFallback
                    )}
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <User className="w-4 h-4" />
                      <span>Artist</span>
                    </div>
                    <p className="font-medium text-foreground">
                      {displayName}
                    </p>
                  </div>
                </div>

                {/* Upload Date and Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Uploaded</p>
                      <p className="text-sm font-medium">
                        {song.createdAt ? formatRelativeTime(song.createdAt) : 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">
                        {formatDuration(parseInt(song.duration) || 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      <ArtistProfilePopup
        userId={userId}
        isOpen={isArtistPopupOpen}
        onClose={() => setIsArtistPopupOpen(false)}
      />
    </>
  );
}