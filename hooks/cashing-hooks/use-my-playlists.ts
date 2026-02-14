import { useState, useEffect } from 'react';
import { getMyPlaylists } from '@/lib/api/api-calls/user_APIs/playlist_APIs/playlists';

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

// Global cache for playlists to avoid duplicate requests
let playlistsCache: Playlist[] | null = null;
let playlistsLoading = false;
let playlistsError: string | null = null;
const listeners: ((playlists: Playlist[], loading: boolean, error: string | null) => void)[] = [];

export const useMyPlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(playlistsCache || []);
  const [loading, setLoading] = useState<boolean>(!playlistsCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If we already have cached data, use it
    if (playlistsCache) {
      setPlaylists(playlistsCache);
      setLoading(false);
      setError(playlistsError);
      return;
    }

    // If we're already loading, just listen for updates
    if (playlistsLoading) {
      const listener = (newPlaylists: Playlist[], newLoading: boolean, newError: string | null) => {
        setPlaylists(newPlaylists);
        setLoading(newLoading);
        setError(newError);
      };
      listeners.push(listener);

      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      };
    }

    const fetchPlaylists = async () => {
      try {
        playlistsLoading = true;
        setLoading(true);

        const data = await getMyPlaylists();

        playlistsCache = data;
        playlistsError = null;

        setPlaylists(data);
        setError(null);

        // Notify all listeners
        listeners.forEach(listener => listener(data, false, null));

      } catch (err: any) {
        playlistsError = err.message;
        playlistsCache = [];

        setError(err.message);
        setPlaylists([]);

        // Notify all listeners
        listeners.forEach(listener => listener([], false, err.message));

      } finally {
        playlistsLoading = false;
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return { playlists, loading, error };
};