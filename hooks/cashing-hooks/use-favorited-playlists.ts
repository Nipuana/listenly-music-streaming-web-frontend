import { useCallback, useEffect, useState } from "react";
import { getFavoritedPlaylists } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlist-favorites";
import {
  playlistFavoriteStatusCache,
  subscribePlaylistFavoriteStatus,
} from "@/hooks/cashing-hooks/use-playlist-favorite-status";
import { isPlaylistPublic } from "@/lib/utils/playlist-visibility";

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

const transformPlaylist = (apiPlaylist: any): Playlist => ({
  id: apiPlaylist._id || apiPlaylist.id,
  name: apiPlaylist.name,
  coverUrl: apiPlaylist.coverImageUrl || apiPlaylist.coverUrl || "",
  trackCount: apiPlaylist.songs?.length || apiPlaylist.trackCount || 0,
});

let favoritedCache: Playlist[] | null = null;
let favoritedLoading = false;
let favoritedError: string | null = null;
const listeners: ((playlists: Playlist[], loading: boolean, error: string | null) => void)[] = [];

export const refetchFavoritedPlaylists = async () => {
  if (favoritedLoading) return;
  try {
    favoritedLoading = true;

    const data: any = await getFavoritedPlaylists();
    const raw = Array.isArray(data) ? data : data?.data || data?.playlists || data?.items || [];
    const transformed: Playlist[] = raw.filter(isPlaylistPublic).map(transformPlaylist);

    // Seed the status cache so cards don’t refetch immediately.
    transformed.forEach((p) => playlistFavoriteStatusCache.set(p.id, true));

    favoritedCache = transformed;
    favoritedError = null;
    listeners.forEach((l) => l(transformed, false, null));
  } catch (err: any) {
    favoritedError = err.message;
    favoritedCache = null;
    listeners.forEach((l) => l([], false, err.message));
  } finally {
    favoritedLoading = false;
  }
};

export const useFavoritedPlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(favoritedCache || []);
  const [loading, setLoading] = useState<boolean>(!favoritedCache);
  const [error, setError] = useState<string | null>(favoritedError);

  useEffect(() => {
    const unsubscribe = subscribePlaylistFavoriteStatus((id, isFav) => {
      // Keep the favorites section in sync with toggles.
      if (!isFav) {
        if (favoritedCache && favoritedCache.some((p) => p.id === id)) {
          favoritedCache = favoritedCache.filter((p) => p.id !== id);
          listeners.forEach((l) => l(favoritedCache || [], false, favoritedError));
        }
        return;
      }

      // When favorited elsewhere, refetch once so we get full objects.
      // (We intentionally avoid trying to synthesize playlist objects here.)
      void refetchFavoritedPlaylists();
    });

    if (favoritedCache) {
      setPlaylists(favoritedCache);
      setLoading(false);
      setError(favoritedError);
      return () => unsubscribe();
    }

    const listener = (newPlaylists: Playlist[], newLoading: boolean, newError: string | null) => {
      setPlaylists(newPlaylists);
      setLoading(newLoading);
      setError(newError);
    };
    listeners.push(listener);

    if (!favoritedLoading) {
      setLoading(true);
      refetchFavoritedPlaylists().finally(() => setLoading(false));
    }

    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
      unsubscribe();
    };
  }, []);

  const refetch = useCallback(async () => {
    setLoading(true);
    await refetchFavoritedPlaylists();
    setLoading(false);
  }, []);

  return { playlists, loading, error, refetch };
};
