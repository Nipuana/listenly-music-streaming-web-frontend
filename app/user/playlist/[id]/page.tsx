"use client";

import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";
import Header from "@/components/layout/header";
import { SidebarLayout } from "@/components/layout/sidebar/SidebarLayout";
import PlaylistView from "./_components/PlaylistView";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { getPlaylistById } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlists";
import { formatDuration } from "@/app/user/liked/utils/formatting-utils";
import Image from "next/image";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";

export default function PlaylistPage() {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, logout } = useAuth();

  const [chunks, setChunks] = useState<any[][]>([]);
  const [chunkIndex, setChunkIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    (async () => {
      try {
        const resp: any = await getPlaylistById(id as string);
        const p = resp && typeof resp === "object" ? resp.data || resp.playlist || resp : resp;
        setPlaylist(p);

        // playlist.songs may be an array of items or wrappers
        let arr: any[] = p?.songs || [];
        if (arr.length && arr[0]?.song) {
          // unwrap if backend returns { song: {...} }
          arr = arr.map((x: any) => x.song);
        } else if (arr.length && arr[0]?.songId) {
          // unwrap if backend returns { songId: {...}, position: ... }
          arr = arr.map((x: any) => x.songId);
        }

        const newChunks: any[][] = [];
        for (let i = 0; i < arr.length; i += 10) {
          newChunks.push(arr.slice(i, i + 10));
        }
        setChunks(newChunks);
        setChunkIndex(0);
      } catch (e: any) {
        console.error("playlist load failed", e);
        setError(e?.message || "Failed to load playlist");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const songCount = playlist?.songs?.length || 0;
  const totalMs = playlist?.songs?.reduce((a: number, s: any) => a + (parseInt(s.duration) || 0), 0) || 0;
  const formatted = formatDuration(totalMs);

  if (loading) {
    return (
      <SidebarProvider user={user}>
        <Header title="Loading..." />
        <SidebarLayout mode="user" user={user} onLogout={logout}>
          <div className="p-8">Loading playlist...</div>
        </SidebarLayout>
      </SidebarProvider>
    );
  }

  if (error || !playlist) {
    return (
      <SidebarProvider user={user}>
        <Header title="Playlist" />
        <SidebarLayout mode="user" user={user} onLogout={logout}>
          <div className="p-8 text-red-500">{error || "Playlist not found"}</div>
        </SidebarLayout>
      </SidebarProvider>
    );
  }

  const currentSongs = chunks[chunkIndex] || [];

  return (
    <SidebarProvider user={user}>
      <SidebarLayout mode="user" user={user} onLogout={logout}>
        <PlaylistView playlist={{ ...playlist, songs: currentSongs }} />

        {/* pagination controls */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              disabled={chunkIndex === 0}
              onClick={() => setChunkIndex((i) => Math.max(i - 1, 0))}
              className="px-3 py-1 bg-card rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-sm">
              Page {chunkIndex + 1} of {chunks.length}
            </span>
            <button
              disabled={chunkIndex >= chunks.length - 1}
              onClick={() => setChunkIndex((i) => Math.min(i + 1, chunks.length - 1))}
              className="px-3 py-1 bg-card rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </SidebarLayout>
    </SidebarProvider>
  );
}
