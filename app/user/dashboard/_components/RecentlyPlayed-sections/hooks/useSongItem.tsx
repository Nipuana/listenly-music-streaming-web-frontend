"use client";

import { useState } from "react";
import { useSongLikeStatus } from "@/hooks/cashing-hooks/use-song-like-status";
import { useArtistProfile } from "@/hooks/artist-hooks/use-artist-profile";
import { toast } from "react-toastify";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  audioUrl?: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; username?: string; [key: string]: any };
  createdAt?: string;
}

export function useSongItem(song: Song) {
  const { isLiked, loading: likeLoading, toggleLikeStatus } = useSongLikeStatus(song.id);

  // Extract user ID from uploadedBy field
  const userId = typeof song.uploadedBy === 'object' && song.uploadedBy !== null
    ? (song.uploadedBy._id || song.uploadedBy.id || '')
    : (song.uploadedBy || '');

  const { name: artistName, profilePicSrc, profilePicFallback, loading: artistLoading } = useArtistProfile(userId || undefined);

  const [isArtistPopupOpen, setIsArtistPopupOpen] = useState(false);

  const handleLikeSong = async () => {
    if (likeLoading) return;

    const wasLiked = isLiked;

    try {
      await toggleLikeStatus();

      if (!wasLiked) {
        toast.success("Song liked", {
          icon: <ThumbsUp className="w-4 h-4" />,
          style: { backgroundColor: '#10B981', color: 'white' }
        });
      } else {
        toast.error("Song unliked", {
          icon: <ThumbsDown className="w-4 h-4" />,
          style: { backgroundColor: '#EF4444', color: 'white' }
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error('Failed to update like status');
    }
  };

  return {
    // Like functionality
    isLiked,
    likeLoading,
    handleLikeSong,

    // Artist data
    userId,
    artistName,
    profilePicSrc,
    profilePicFallback,
    artistLoading,

    // Popup state
    isArtistPopupOpen,
    openArtistPopup: () => setIsArtistPopupOpen(true),
    closeArtistPopup: () => setIsArtistPopupOpen(false),
  };
}