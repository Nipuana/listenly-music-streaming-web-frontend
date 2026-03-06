// Hook for managing playlist favorite status with global caching
// Mirrors the song like-status cache pattern so multiple cards stay in sync

import { createElement, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AlertTriangle, Star, StarOff } from "lucide-react";
import {
  getFavoriteStatus,
  toggleFavorite,
} from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlist-favorites";

export const playlistFavoriteStatusCache = new Map<string, boolean>();
export const playlistFavoriteStatusLoadingCache = new Map<string, boolean>();

const listeners: Array<(playlistId: string, isFavorited: boolean) => void> = [];

export const subscribePlaylistFavoriteStatus = (
  listener: (playlistId: string, isFavorited: boolean) => void
) => {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
};

export const usePlaylistFavoriteStatus = (playlistId: string) => {
  const [isFavorited, setIsFavorited] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const notify = useCallback((id: string, fav: boolean) => {
    listeners.forEach((l) => l(id, fav));
  }, []);

  const addListener = useCallback((listener: (id: string, fav: boolean) => void) => {
    listeners.push(listener);
  }, []);

  const removeListener = useCallback((listener: (id: string, fav: boolean) => void) => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  }, []);

  const fetchFavoriteStatus = useCallback(async () => {
    if (!playlistId) return;

    if (playlistFavoriteStatusCache.has(playlistId)) {
      setIsFavorited(playlistFavoriteStatusCache.get(playlistId)!);
      return;
    }

    if (playlistFavoriteStatusLoadingCache.get(playlistId)) {
      return;
    }

    try {
      playlistFavoriteStatusLoadingCache.set(playlistId, true);
      setLoading(true);

      const data: any = await getFavoriteStatus(playlistId);
      const favorited = Boolean(data?.data?.favorited ?? data?.favorited ?? false);

      playlistFavoriteStatusCache.set(playlistId, favorited);
      setIsFavorited(favorited);
      notify(playlistId, favorited);
    } catch (error) {
      console.error("Failed to fetch playlist favorite status:", error);
    } finally {
      playlistFavoriteStatusLoadingCache.set(playlistId, false);
      setLoading(false);
    }
  }, [playlistId, notify]);

  const toggleFavoriteStatus = useCallback(async () => {
    if (loading || !playlistId) return;

    const wasFavorited = isFavorited;

    try {
      setLoading(true);

      const optimistic = !wasFavorited;
      setIsFavorited(optimistic);
      playlistFavoriteStatusCache.set(playlistId, optimistic);
      notify(playlistId, optimistic);

      const data: any = await toggleFavorite(playlistId);
      const actual = Boolean(data?.data?.favorited ?? data?.favorited ?? optimistic);

      if (actual !== optimistic) {
        setIsFavorited(actual);
        playlistFavoriteStatusCache.set(playlistId, actual);
        notify(playlistId, actual);
      }

      if (!wasFavorited && actual) {
        toast.success("Playlist favorited", {
          icon: () =>
            createElement(Star, {
              className: "w-4 h-4 text-yellow-400",
              fill: "currentColor",
            }),
        });
      } else if (wasFavorited && !actual) {
        toast.info("Playlist unfavorited", {
          icon: () => createElement(StarOff, { className: "w-4 h-4" }),
        });
      }
    } catch (error) {
      console.error("Failed to toggle playlist favorite status:", error);
      setIsFavorited(wasFavorited);
      playlistFavoriteStatusCache.set(playlistId, wasFavorited);
      notify(playlistId, wasFavorited);

      toast.error("Failed to update favorite", {
        icon: () => createElement(AlertTriangle, { className: "w-4 h-4" }),
      });
    } finally {
      setLoading(false);
    }
  }, [playlistId, isFavorited, loading, notify]);

  const handleCacheUpdate = useCallback(
    (updatedId: string, updatedFav: boolean) => {
      if (updatedId === playlistId) setIsFavorited(updatedFav);
    },
    [playlistId]
  );

  useEffect(() => {
    addListener(handleCacheUpdate);

    if (playlistId && !playlistFavoriteStatusCache.has(playlistId) && !playlistFavoriteStatusLoadingCache.get(playlistId)) {
      fetchFavoriteStatus();
    } else if (playlistId && playlistFavoriteStatusCache.has(playlistId)) {
      setIsFavorited(playlistFavoriteStatusCache.get(playlistId)!);
    }

    return () => {
      removeListener(handleCacheUpdate);
    };
  }, [playlistId, addListener, removeListener, handleCacheUpdate, fetchFavoriteStatus]);

  return { isFavorited, loading, toggleFavoriteStatus };
};
