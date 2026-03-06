import { useCallback, useEffect, useState } from "react";
import { getAllPlaylists } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlists";

export interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
  [key: string]: unknown;
}

const transformPlaylist = (apiPlaylist: any): Playlist => ({
  ...apiPlaylist,
  id: apiPlaylist?._id || apiPlaylist?.id,
  name: apiPlaylist?.name,
  coverUrl: apiPlaylist?.coverUrl || apiPlaylist?.coverImageUrl || apiPlaylist?.coverImage || "",
  trackCount: apiPlaylist?.trackCount ?? (Array.isArray(apiPlaylist?.songs) ? apiPlaylist.songs.length : 0),
});

let allPlaylistsCache: Playlist[] | null = null;
let allPlaylistsLoading = false;
let allPlaylistsError: string | null = null;
const listeners: ((playlists: Playlist[], loading: boolean, error: string | null) => void)[] = [];

export const clearAllPlaylistsCache = () => {
  allPlaylistsCache = null;
  allPlaylistsLoading = false;
  allPlaylistsError = null;
  listeners.forEach((l) => l([], false, null));
};

export const removeFromAllPlaylistsCache = (playlistId: string) => {
  if (!playlistId) return;
  if (!allPlaylistsCache) return;
  allPlaylistsCache = allPlaylistsCache.filter((p) => p.id !== playlistId);
  listeners.forEach((l) => l(allPlaylistsCache || [], false, allPlaylistsError));
};

export const refetchAllPlaylists = async () => {
  if (allPlaylistsLoading) return;
  try {
    allPlaylistsLoading = true;

    const data: any = await getAllPlaylists();
    const raw = Array.isArray(data) ? data : data?.data || data?.playlists || data?.items || [];
    const normalized: Playlist[] = (Array.isArray(raw) ? raw : []).map(transformPlaylist);

    allPlaylistsCache = normalized;
    allPlaylistsError = null;
    listeners.forEach((l) => l(normalized, false, null));
  } catch (err: any) {
    allPlaylistsError = err.message;
    allPlaylistsCache = null;
    listeners.forEach((l) => l([], false, err.message));
  } finally {
    allPlaylistsLoading = false;
  }
};

export const useAllPlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(allPlaylistsCache || []);
  const [loading, setLoading] = useState<boolean>(!allPlaylistsCache);
  const [error, setError] = useState<string | null>(allPlaylistsError);

  useEffect(() => {
    const listener = (newPlaylists: Playlist[], newLoading: boolean, newError: string | null) => {
      setPlaylists(newPlaylists);
      setLoading(newLoading);
      setError(newError);
    };
    listeners.push(listener);

    if (allPlaylistsCache) {
      setPlaylists(allPlaylistsCache);
      setLoading(false);
      setError(allPlaylistsError);
    } else if (!allPlaylistsLoading) {
      setLoading(true);
      void refetchAllPlaylists().finally(() => setLoading(false));
    }

    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    await refetchAllPlaylists();
    setLoading(false);
  }, []);

  return { playlists, loading, error, refetch };
};
