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

export function PlaylistsSection() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const data = await getAllPlaylists();
        setPlaylists(Array.isArray(data) ? data : data?.data || data?.playlists || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch playlists");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <div className="text-center py-10">
          <p className="text-foreground-muted">Loading playlists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-10">
        <div className="text-center py-10">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <PlaylistsGrid playlists={playlists} />
    </div>
  );
}