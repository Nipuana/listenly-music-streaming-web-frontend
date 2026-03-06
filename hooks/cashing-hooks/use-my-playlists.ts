import { useState, useEffect, useCallback } from 'react';
import { getMyPlaylists } from '@/lib/api/api-calls/user_APIs/playlist_APIs/playlists';

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

// Transform API response to match expected interface
const transformPlaylist = (apiPlaylist: any): Playlist => ({
  ...apiPlaylist,
  id: apiPlaylist?._id || apiPlaylist?.id,
  name: apiPlaylist?.name,
  coverUrl: apiPlaylist?.coverImageUrl || apiPlaylist?.coverUrl || '',
  trackCount: apiPlaylist?.songs?.length || apiPlaylist?.trackCount || 0,
});

const orderNewestFirst = (playlists: Playlist[]): Playlist[] => {
  const list = Array.isArray(playlists) ? playlists : [];
  if (list.length <= 1) return list;

  const getTime = (p: any) => {
    const raw = p?.updatedAt || p?.createdAt || p?.updated_at || p?.created_at || p?.date || p?.timestamp;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : 0;
  };

  const hasTimestamp = list.some((p: any) => getTime(p) > 0);
  if (hasTimestamp) {
    return [...list].sort((a: any, b: any) => getTime(b) - getTime(a));
  }

  // Fallback to “last to first” if API doesn’t provide timestamps.
  return [...list].reverse();
};

// Global cache for playlists to avoid duplicate requests
let playlistsCache: Playlist[] | null = null;
let playlistsLoading = false;
let playlistsError: string | null = null;
const listeners: ((playlists: Playlist[], loading: boolean, error: string | null) => void)[] = [];

export const clearMyPlaylistsCache = () => {
  playlistsCache = null;
  playlistsLoading = false;
  playlistsError = null;
  listeners.forEach((listener) => listener([], false, null));
};

export const removeFromMyPlaylistsCache = (playlistId: string) => {
  if (!playlistId) return;
  if (!playlistsCache) return;
  playlistsCache = playlistsCache.filter((p) => p.id !== playlistId);
  listeners.forEach((listener) => listener(playlistsCache || [], false, playlistsError));
};

// Global refetch function that can be called from anywhere
export const refetchMyPlaylists = async () => {
  if (playlistsLoading) return;
  try {
    playlistsLoading = true;

    const data = await getMyPlaylists();
    
    // Transform API data to match expected interface
    // API might return an object with playlists array or just an array
    let playlistsArray = [];
    if (Array.isArray(data)) {
      playlistsArray = data;
    } else if (data && typeof data === 'object') {
      // Check common response structures
      playlistsArray = data.data || data.playlists || data.items || [];
    }
    
    const transformedData = orderNewestFirst(playlistsArray.map(transformPlaylist));

    playlistsCache = transformedData;
    playlistsError = null;

    // Notify all listeners
    listeners.forEach(listener => listener(transformedData, false, null));

  } catch (err: any) {
    playlistsError = err.message;
    playlistsCache = null;

    // Notify all listeners
    listeners.forEach(listener => listener([], false, err.message));

  } finally {
    playlistsLoading = false;
  }
};

export const useMyPlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(playlistsCache || []);
  const [loading, setLoading] = useState<boolean>(!playlistsCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listener = (newPlaylists: Playlist[], newLoading: boolean, newError: string | null) => {
      setPlaylists(newPlaylists);
      setLoading(newLoading);
      setError(newError);
    };
    listeners.push(listener);

    // Always hydrate from cache if present, but keep listening for future updates.
    if (playlistsCache) {
      setPlaylists(playlistsCache);
      setLoading(false);
      setError(playlistsError);
    }

    const fetchPlaylists = async () => {
      try {
        if (playlistsLoading) return;
        playlistsLoading = true;
        setLoading(true);

        const data = await getMyPlaylists();
        
        // Transform API data to match expected interface
        // API might return an object with playlists array or just an array
        let playlistsArray = [];
        if (Array.isArray(data)) {
          playlistsArray = data;
        } else if (data && typeof data === 'object') {
          // Check common response structures
          playlistsArray = data.data || data.playlists || data.items || [];
        }
        
        const transformedData = orderNewestFirst(playlistsArray.map(transformPlaylist));

        playlistsCache = transformedData;
        playlistsError = null;

        setPlaylists(transformedData);
        setError(null);

        // Notify all listeners
        listeners.forEach(listener => listener(transformedData, false, null));

      } catch (err: any) {
        playlistsError = err.message;
        playlistsCache = null;

        setError(err.message);
        setPlaylists([]);

        // Notify all listeners
        listeners.forEach(listener => listener([], false, err.message));

      } finally {
        playlistsLoading = false;
        setLoading(false);
      }
    };

    // Only fetch if we don't have cache and nothing else is already fetching.
    if (!playlistsCache && !playlistsLoading) {
      fetchPlaylists();
    }

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  const refetch = useCallback(async () => {
    try {
      if (playlistsLoading) return;
      playlistsLoading = true;
      setLoading(true);

      const data = await getMyPlaylists();
      
      // Transform API data to match expected interface
      // API might return an object with playlists array or just an array
      let playlistsArray = [];
      if (Array.isArray(data)) {
        playlistsArray = data;
      } else if (data && typeof data === 'object') {
        // Check common response structures
        playlistsArray = data.data || data.playlists || data.items || [];
      }
      
      const transformedData = orderNewestFirst(playlistsArray.map(transformPlaylist));

      playlistsCache = transformedData;
      playlistsError = null;

      setPlaylists(transformedData);
      setError(null);

      // Notify all listeners
      listeners.forEach(listener => listener(transformedData, false, null));

    } catch (err: any) {
      playlistsError = err.message;
      playlistsCache = null;

      setError(err.message);
      setPlaylists([]);

      // Notify all listeners
      listeners.forEach(listener => listener([], false, err.message));

    } finally {
      playlistsLoading = false;
      setLoading(false);
    }
  }, []);

  return { playlists, loading, error, refetch };
};