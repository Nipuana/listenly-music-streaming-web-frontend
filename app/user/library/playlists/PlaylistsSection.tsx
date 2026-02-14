"use client";

import { useState, useEffect } from "react";
import { PlaylistsGrid } from "./_components/PlaylistsGrid";
import { getAllPlaylists } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlists";

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

interface PlaylistsSectionProps {
  playlists: any[];
}

export function PlaylistsSection({ playlists }: PlaylistsSectionProps) {

  return (
    <div className="flex flex-col gap-10">
      <PlaylistsGrid playlists={playlists} />
    </div>
  );
}