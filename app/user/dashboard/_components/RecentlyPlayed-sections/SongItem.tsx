"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";
import { ArtistProfilePopup } from "../../../_components/popups/ArtistProfilePopup";
// Import new components and hook
import { ArtistAvatar } from "./ArtistAvatar";
import { SongCardActions } from "./SongCardActions";
import { SongCardDropdown } from "./SongCardDropdown";
import { useSongItem } from "./hooks/useSongItem";

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

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

interface SongItemProps {
  song: Song;
  playlists: Playlist[];
  onSongClick: (song: Song) => void;
  onPlay: (song: Song) => void;
  onAddToPlaylist: (songId: string, playlistId: string) => void;
}

export function SongItem({ song, playlists, onSongClick, onPlay, onAddToPlaylist }: SongItemProps) {
  const {
    isLiked,
    likeLoading,
    handleLikeSong,
    userId,
    artistName,
    isArtistPopupOpen,
    openArtistPopup,
    closeArtistPopup
  } = useSongItem(song);

  return (
    <>
      <Card
        className="group border-border/50 hover:shadow-primary transition-all cursor-pointer overflow-hidden card-responsive"
        onClick={() => onSongClick(song)}
      >
        <CardContent className="p-4">
          <div className="relative mb-3">
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={getSongCoverUrl(song.coverImageUrl)}
                alt={song.title}
                className="w-full h-full object-cover"
              />
            </div>

            <SongCardActions
              song={song}
              isLiked={isLiked}
              likeLoading={likeLoading}
              onPlay={onPlay}
              onLike={handleLikeSong}
            />

            <SongCardDropdown
              song={song}
              playlists={playlists}
              isLiked={isLiked}
              likeLoading={likeLoading}
              onLike={handleLikeSong}
              onAddToPlaylist={onAddToPlaylist}
              onArtistClick={openArtistPopup}
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <ArtistAvatar
              userId={userId}
              size={24}
              onClick={openArtistPopup}
            />
            <span className="text-xs text-muted-foreground truncate">{artistName || song.artist || 'Unknown Artist'}</span>
          </div>

          <h4 className="font-semibold truncate">{song.title}</h4>
        </CardContent>
      </Card>

      <ArtistProfilePopup
        userId={userId}
        isOpen={isArtistPopupOpen}
        onClose={closeArtistPopup}
      />
    </>
  );
}