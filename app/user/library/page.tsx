"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";
import { SidebarLayout } from "@/components/layout/sidebar/SidebarLayout";
import { SongsSection } from "./songs/SongsSection";
import { PlaylistsSection } from "./playlists/PlaylistsSection";
import { getAllSongs } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
import { getAllPlaylists } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlists";
import { getLikedSongs } from "@/lib/api/api-calls/user_APIs/song_APIs/song-likes";
import { useAuth } from "@/Providers/Contexts/auth-context";

// Import the cache from the hook to populate it
import { likeStatusCache } from "@/hooks/cashing-hooks/use-song-like-status";
import Loading from "./loading";
import Header from "@/components/layout/header";

export default function LibraryPage() {
  const { user, logout } = useAuth(); // used for other logic but not passed to layout
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [playlistsLoaded, setPlaylistsLoaded] = useState(false);
  const [likedSongsLoaded, setLikedSongsLoaded] = useState(false);
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const isFullyLoaded = songsLoaded && playlistsLoaded && likedSongsLoaded;

  // Load data at page level
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await getAllSongs();
        setSongs(Array.isArray(data) ? data : data?.data || data?.songs || []);
      } catch (error) {
        console.error('Failed to load songs:', error);
      } finally {
        setSongsLoaded(true);
      }
    };

    const loadPlaylists = async () => {
      try {
        const data = await getAllPlaylists();
        setPlaylists(Array.isArray(data) ? data : data?.data || data?.playlists || []);
      } catch (error) {
        console.error('Failed to load playlists:', error);
      } finally {
        setPlaylistsLoaded(true);
      }
    };

    const loadLikedSongs = async () => {
      try {
        const likedSongsData = await getLikedSongs();
        // Populate the cache with liked song IDs
        const likedSongs = Array.isArray(likedSongsData) ? likedSongsData : likedSongsData?.data || [];
        likedSongs.forEach((song: any) => {
          if (song?.id || song?._id) {
            likeStatusCache.set(song.id || song._id, true);
          }
        });
      } catch (error) {
        console.error('Failed to load liked songs:', error);
      } finally {
        setLikedSongsLoaded(true);
      }
    };

    loadSongs();
    loadPlaylists();
    loadLikedSongs();
  }, []);

  // Don't render content until all data is loaded
  if (!isFullyLoaded) {
    return (
      <SidebarProvider user={user}>
        <Header />
        <SidebarLayout mode="user" user={user} onLogout={logout}>
          <div className="max-w-7xl mx-auto">
            <Loading />
          </div>
        </SidebarLayout>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider user={user}>
      <Header />
      <SidebarLayout mode="user" user={user} onLogout={logout}>
        <div className="max-w-7xl mx-auto">
          <SongsSection songs={songs} playlists={playlists} />
          <PlaylistsSection playlists={playlists} />
        </div>
      </SidebarLayout>
    </SidebarProvider>
  );
}