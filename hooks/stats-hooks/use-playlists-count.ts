import { useState, useEffect } from 'react';
import { getMyPlaylists } from '@/lib/api/api-calls/user_APIs/playlist_APIs/playlists';

export const usePlaylistsCount = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylistsCount = async () => {
      try {
        setLoading(true);
        const playlists = await getMyPlaylists();
        setCount(playlists.length);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylistsCount();
  }, []);

  return { count, loading, error };
};