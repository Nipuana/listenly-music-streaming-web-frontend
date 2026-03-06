import { useState, useEffect } from 'react';
import { getFavoritedPlaylists } from '@/lib/api/api-calls/user_APIs/playlist_APIs/playlist-favorites';

export const useFavoritedPlaylistsCount = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        setLoading(true);
        const data = await getFavoritedPlaylists();
        const playlists = Array.isArray(data) ? data : data?.data || [];
        setCount(playlists.length);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return { count, loading, error };
};
