"use client";

import { MoreHorizontal, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ArtistAvatar } from "./ArtistAvatar";

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

interface SongCardDropdownProps {
  song: Song;
  playlists: Playlist[];
  isLiked: boolean;
  likeLoading: boolean;
  onLike: () => void;
  onAddToPlaylist: (songId: string, playlistId: string) => void;
  onArtistClick: () => void;
}

export function SongCardDropdown({
  song,
  playlists,
  isLiked,
  likeLoading,
  onLike,
  onAddToPlaylist,
  onArtistClick
}: SongCardDropdownProps) {
  // Extract user ID from uploadedBy field
  const userId = typeof song.uploadedBy === 'object' && song.uploadedBy !== null
    ? (song.uploadedBy._id || song.uploadedBy.id || '')
    : (song.uploadedBy || '');

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-black/50 hover:bg-black/70 border-none h-8 w-8"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4 text-white" />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>More options</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onLike(); }} disabled={likeLoading}>
          <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          {isLiked ? 'Unlike' : 'Like'}
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Plus className="w-4 h-4 mr-2" />
            Add to Playlist
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <DropdownMenuItem
                  key={playlist.id}
                  onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song.id, playlist.id); }}
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
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 rounded-md p-1 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onArtistClick();
                }}
              >
                <ArtistAvatar userId={userId} size={24} showTooltip={false} />
                <span className="text-sm font-medium">View Artist</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>View artist profile</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}