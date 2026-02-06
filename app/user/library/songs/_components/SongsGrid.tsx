"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverUrl: string;
}

interface SongsGridProps {
  title: string;
  songs: Song[];
  onPlaySong?: (songId: string) => void;
}

export function SongsGrid({ title, songs, onPlaySong }: SongsGridProps) {
  return (
    <Card className="bg-card backdrop-blur-md border-border shadow-lg mb-10 overflow-hidden">
      <CardHeader className="bg-background-secondary border-b border-border">
        <CardTitle className="text-foreground font-bold text-xl">
          {title} ({songs.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {songs.map((song) => (
            <Card
              key={song.id}
              className="group border-border bg-background-secondary hover:shadow-shadow-primary transition-all cursor-pointer overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={getSongCoverUrl(song.coverUrl)}
                    alt={song.title || 'Song cover'}
                    className="w-full aspect-square rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300"
                    draggable="false"
                  />
                  <Button
                    size="icon"
                    onClick={() => onPlaySong?.(song.id)}
                    className="absolute bottom-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-gradient-primary hover:scale-110 border-none h-10 w-10"
                  >
                    <Play
                      className="w-4 h-4 ml-0.5 text-primary-foreground"
                      fill="currentColor"
                    />
                  </Button>
                </div>
                <h3 className="text-sm font-bold text-foreground truncate mb-1">
                  {song.title}
                </h3>
                <p className="text-xs text-foreground-muted truncate font-medium mb-1">
                  {song.artist}
                </p>
                <p className="text-xs text-foreground-muted/60">
                  {song.duration}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}