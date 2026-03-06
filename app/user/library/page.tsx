"use client";

import React, { useState, useEffect, useMemo } from "react";
import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";
import { SidebarLayout } from "@/components/layout/sidebar/SidebarLayout";
import { SongsSection } from "./songs/SongsSection";
import { PlaylistsSection } from "./playlists/PlaylistsSection";
import { getAllSongs } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
import { useAllPlaylists } from "@/hooks/cashing-hooks/use-all-playlists";
import { getLikedSongs } from "@/lib/api/api-calls/user_APIs/song_APIs/song-likes";
import { getFavoritedPlaylists } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlist-favorites";
import { useAuth } from "@/Providers/Contexts/auth-context";

// Import the cache from the hook to populate it
import { likeStatusCache } from "@/hooks/cashing-hooks/use-song-like-status";
import { playlistFavoriteStatusCache } from "@/hooks/cashing-hooks/use-playlist-favorite-status";
import { isPlaylistPublic } from "@/lib/utils/playlist-visibility";
import Loading from "./loading";
import Header from "@/components/layout/header";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  audioUrl?: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; [key: string]: unknown };
}

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
  [key: string]: unknown;
}

export default function LibraryPage() {
  const { user, logout } = useAuth(); // used for other logic but not passed to layout
  const [songsLoaded, setSongsLoaded] = useState(false);
  const [likedSongsLoaded, setLikedSongsLoaded] = useState(false);
  const [favoritedPlaylistsLoaded, setFavoritedPlaylistsLoaded] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const { playlists: allPlaylists, loading: playlistsLoading } = useAllPlaylists();
  const playlists = useMemo(() => allPlaylists.filter(isPlaylistPublic), [allPlaylists]);
  const isFullyLoaded = songsLoaded && !playlistsLoading && likedSongsLoaded && favoritedPlaylistsLoaded;

  // Load data at page level
  useEffect(() => {
    const loadSongs = async () => {
      try {
        const data = await getAllSongs();
        const rawSongs = Array.isArray(data) ? data : data?.data || data?.songs || [];
        setSongs((Array.isArray(rawSongs) ? rawSongs : []) as Song[]);
      } catch (error) {
        console.error('Failed to load songs:', error);
      } finally {
        setSongsLoaded(true);
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

    const loadFavoritedPlaylists = async () => {
      try {
        const favoritedData: any = await getFavoritedPlaylists();
        const favorited = Array.isArray(favoritedData) ? favoritedData : favoritedData?.data || [];
        favorited.forEach((p: any) => {
          const pid = p?.id || p?._id;
          if (pid) playlistFavoriteStatusCache.set(pid, true);
        });
      } catch (error) {
        console.error('Failed to load favorited playlists:', error);
      } finally {
        setFavoritedPlaylistsLoaded(true);
      }
    };

    loadSongs();
    loadLikedSongs();
    loadFavoritedPlaylists();
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