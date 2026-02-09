// Hook for managing song like status with global caching
// Prevents duplicate API calls for like status across multiple SongCard components

import { useState, useEffect, useCallback } from 'react';
import { getLikeStatus, toggleLike } from '@/lib/api/api-calls/user_APIs/song_APIs/song-likes';

// Global cache for like status to prevent duplicate API calls
export const likeStatusCache = new Map<string, boolean>();
export const likeStatusLoadingCache = new Map<string, boolean>();

// Global listeners for cache updates
const likeStatusListeners: Array<(songId: string, isLiked: boolean) => void> = [];

export const useSongLikeStatus = (songId: string) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Function to notify all listeners of cache updates
  const notifyListeners = useCallback((songId: string, isLiked: boolean) => {
    likeStatusListeners.forEach(listener => listener(songId, isLiked));
  }, []);

  // Function to add this component as a listener
  const addListener = useCallback((listener: (songId: string, isLiked: boolean) => void) => {
    likeStatusListeners.push(listener);
  }, []);

  // Function to remove this component as a listener
  const removeListener = useCallback((listener: (songId: string, isLiked: boolean) => void) => {
    const index = likeStatusListeners.indexOf(listener);
    if (index > -1) {
      likeStatusListeners.splice(index, 1);
    }
  }, []);

  // Fetch like status with caching
  const fetchLikeStatus = useCallback(async () => {
    if (!songId) return;

    // Check if already cached
    if (likeStatusCache.has(songId)) {
      setIsLiked(likeStatusCache.get(songId)!);
      return;
    }

    // Check if already loading
    if (likeStatusLoadingCache.get(songId)) {
      return; // Another component is already fetching this
    }

    try {
      likeStatusLoadingCache.set(songId, true);
      setLoading(true);

      const response = await getLikeStatus(songId);
      const liked = response.data?.liked || false;

      // Update cache
      likeStatusCache.set(songId, liked);

      // Update local state
      setIsLiked(liked);

      // Notify all listeners
      notifyListeners(songId, liked);

    } catch (error) {
      console.error('Failed to fetch like status:', error);
    } finally {
      likeStatusLoadingCache.set(songId, false);
      setLoading(false);
    }
  }, [songId, notifyListeners]);

  // Toggle like status
  const toggleLikeStatus = useCallback(async () => {
    if (loading || !songId) return;

    const wasLiked = isLiked;

    try {
      setLoading(true);

      // Optimistically update local state
      const newLikedState = !wasLiked;
      setIsLiked(newLikedState);
      likeStatusCache.set(songId, newLikedState);
      notifyListeners(songId, newLikedState);

      // Make API call
      const response = await toggleLike(songId);
      const actualLikedState = response.data?.liked || false;

      // Update with actual response if different
      if (actualLikedState !== newLikedState) {
        setIsLiked(actualLikedState);
        likeStatusCache.set(songId, actualLikedState);
        notifyListeners(songId, actualLikedState);
      }

    } catch (error) {
      console.error('Failed to toggle like status:', error);
      // Revert optimistic update on error
      setIsLiked(wasLiked);
      likeStatusCache.set(songId, wasLiked);
      notifyListeners(songId, wasLiked);
    } finally {
      setLoading(false);
    }
  }, [songId, isLiked, loading, notifyListeners]);

  // Listener function for cache updates
  const handleCacheUpdate = useCallback((updatedSongId: string, updatedIsLiked: boolean) => {
    if (updatedSongId === songId) {
      setIsLiked(updatedIsLiked);
    }
  }, [songId]);

  // Set up listener on mount
  useEffect(() => {
    addListener(handleCacheUpdate);

    // Fetch initial status if not cached
    if (songId && !likeStatusCache.has(songId) && !likeStatusLoadingCache.get(songId)) {
      fetchLikeStatus();
    } else if (songId && likeStatusCache.has(songId)) {
      // Use cached value
      setIsLiked(likeStatusCache.get(songId)!);
    }

    // Cleanup listener on unmount
    return () => {
      removeListener(handleCacheUpdate);
    };
  }, [songId, addListener, removeListener, handleCacheUpdate, fetchLikeStatus]);

  return {
    isLiked,
    loading,
    toggleLikeStatus
  };
};