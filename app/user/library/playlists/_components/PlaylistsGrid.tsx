"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

interface PlaylistsGridProps {
  playlists: Playlist[];
}

export function PlaylistsGrid({ playlists }: PlaylistsGridProps) {
  return (
    <Card className="bg-card backdrop-blur-md border-border shadow-lg">
      <CardHeader className="bg-background-secondary border-b border-border">
        <CardTitle className="text-foreground font-bold text-xl">
          Playlists
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Card
              key={playlist.id}
              className="border-border bg-background-secondary hover:shadow-shadow-primary transition-all cursor-pointer group overflow-hidden"
            >
              <CardContent className="p-4">
                <Image
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  width={300}
                  height={300}
                  className="w-full aspect-square rounded-xl shadow-md mb-4 group-hover:scale-105 transition-transform duration-300"
                />
                <h3 className="text-sm font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {playlist.name}
                </h3>
                <p className="text-xs text-foreground-muted font-medium">
                  {playlist.trackCount} tracks
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}