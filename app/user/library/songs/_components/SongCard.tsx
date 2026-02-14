"use client";

import { Play, MoreHorizontal, Heart, Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";
import { useMyPlaylists } from "@/hooks/cashing-hooks/use-my-playlists";
import { useArtistProfile } from "@/hooks/artist-hooks/use-artist-profile";
import { useSongLikeStatus } from "@/hooks/cashing-hooks/use-song-like-status";
import { getFullImageUrl } from "@/lib/utils/image-util";
import { useState } from "react";
import { toast } from "react-toastify";
import { SongDetailsPopup } from "../../../_components/popups/SongDetailsPopup";
import { ArtistProfilePopup } from "../../../_components/popups/ArtistProfilePopup";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  audioUrl?: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; [key: string]: any };
}

interface SongCardProps {
  song: Song;
  onPlay?: () => void;
}

export function SongCard({ song, onPlay }: SongCardProps) {
  const { playlists } = useMyPlaylists();

  // Extract user ID from uploadedBy field - it could be a string or an object
  const userId = typeof song.uploadedBy === 'object' && song.uploadedBy !== null
    ? (song.uploadedBy._id || song.uploadedBy.id || '')
    : (song.uploadedBy || '');

  const { name: artistName, profilePicSrc, profilePicFallback, loading: artistLoading } = useArtistProfile(userId || undefined);

  // Like functionality using cached hook
  const { isLiked, loading: likeLoading, toggleLikeStatus } = useSongLikeStatus(song.id);

  // Popup state
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isArtistPopupOpen, setIsArtistPopupOpen] = useState(false);

  const handleLikeSong = async (songId: string) => {
    if (likeLoading) return; // Prevent multiple clicks

    const wasLiked = isLiked; // Store the previous state

    try {
      await toggleLikeStatus();
      
      // Show appropriate toast based on the action
      if (!wasLiked) {
        // Song was liked
        toast.success("Song liked", {
          icon: <ThumbsUp className="w-4 h-4" />,
          style: { backgroundColor: '#10B981', color: 'white' } // Green color
        });
      } else {
        // Song was unliked
        toast.error("Song unliked", {
          icon: <ThumbsDown className="w-4 h-4" />,
          style: { backgroundColor: '#EF4444', color: 'white' } // Red color
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error('Failed to update like status');
    }
  };

  const handleAddToPlaylist = (songId: string, playlistId: string) => {
    // TODO: Implement add to playlist functionality
    console.log("Add song", songId, "to playlist", playlistId);
  };

  return (
    <>
      <Card
        className="group border-border bg-background-secondary hover:shadow-shadow-primary transition-all cursor-pointer w-full max-w-64"
        onClick={() => setIsPopupOpen(true)}
      >
      <CardContent className="p-6">
        <div className="relative mb-6">
          <img
            src={getSongCoverUrl(song.coverImageUrl)}
            alt={song.title || 'Song cover'}
            className="w-full aspect-square rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
            draggable="false"
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onPlay?.();
                }}
                className="absolute bottom-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-gradient-primary hover:scale-110 border-none h-12 w-12 cursor-pointer"
              >
                <Play
                  className="w-5 h-5 ml-0.5 text-primary-foreground"
                  fill="currentColor"
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Play</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click
                  handleLikeSong(song.id);
                }}
                disabled={likeLoading}
                className="absolute bottom-3 left-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-gradient-primary hover:scale-110 border-none h-12 w-12 cursor-pointer"
              >
                <Heart
                  className={`w-5 h-5 text-primary-foreground transition-colors ${
                    isLiked ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">{isLiked ? "Unlike" : "Like"}</TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-black/50 hover:bg-black/70 border-none h-10 w-10 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">More options</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align="end" className="w-56" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeSong(song.id);
                }}
                disabled={likeLoading}
              >
                <Heart 
                  className={`w-4 h-4 mr-2 transition-colors ${
                    isLiked ? 'fill-red-500 text-red-500' : ''
                  }`} 
                />
                {likeLoading ? 'Loading...' : (isLiked ? 'Unlike' : 'Like')}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Playlist
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48" onClick={(e) => e.stopPropagation()}>
                  {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                      <DropdownMenuItem
                        key={playlist.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToPlaylist(song.id, playlist.id);
                        }}
                      >
                        {playlist.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No playlists available
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsArtistPopupOpen(true);
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold overflow-hidden">
                    {profilePicSrc ? (
                      <img
                        src={getFullImageUrl(profilePicSrc) || undefined}
                        alt={artistName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      profilePicFallback
                    )}
                  </div>
                  <span className="text-sm font-medium">{artistName}</span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-foreground truncate">
            {song.title}
          </h3>
          <div
            className="flex items-center gap-3 cursor-pointer rounded-md px-2 py-1 border border-border/60 bg-background/70 shadow-sm transition-all hover:bg-background-secondary hover:border-border hover:shadow-md hover:ring-1 hover:ring-primary/40"
            onClick={(e) => {
              e.stopPropagation();
              setIsArtistPopupOpen(true);
            }}
          >
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold overflow-hidden shrink-0">
              {profilePicSrc ? (
                <img
                  src={getFullImageUrl(profilePicSrc) || undefined}
                  alt={artistName}
                  className="w-full h-full object-cover"
                />
              ) : (
                profilePicFallback
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground-muted font-medium truncate">
                {artistName}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <SongDetailsPopup
      song={song}
      isOpen={isPopupOpen}
      onClose={() => setIsPopupOpen(false)}
      onPlay={onPlay || (() => {})}
    />
    <ArtistProfilePopup
      userId={userId}
      isOpen={isArtistPopupOpen}
      onClose={() => setIsArtistPopupOpen(false)}
    />
    </>
  );
}