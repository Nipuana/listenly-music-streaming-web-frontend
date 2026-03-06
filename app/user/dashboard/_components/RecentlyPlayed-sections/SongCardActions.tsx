"use client";

import { Play, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

interface SongCardActionsProps {
  song: Song;
  isLiked: boolean;
  likeLoading: boolean;
  onPlay: (song: Song) => void;
  onLike: () => void;
}

export function SongCardActions({ song, isLiked, likeLoading, onPlay, onLike }: SongCardActionsProps) {
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="absolute bottom-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-primary bg-gradient-primary"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(song);
            }}
          >
            <Play className="w-4 h-4 ml-0.5 fill-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Play song</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="absolute bottom-2 left-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-gradient-primary hover:scale-110 border-none h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            disabled={likeLoading}
          >
            <Heart
              className={`w-4 h-4 text-primary-foreground transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{isLiked ? 'Unlike song' : 'Like song'}</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}