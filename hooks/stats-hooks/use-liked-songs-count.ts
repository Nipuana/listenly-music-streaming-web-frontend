import { useState, useEffect } from 'react';
import { getLikedSongs } from '@/lib/api/api-calls/user_APIs/song_APIs/song-likes';

export const useLikedSongsCount = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedSongsCount = async () => {
      try {
        setLoading(true);
        const data = await getLikedSongs();
        const likedSongs = Array.isArray(data) ? data : data?.data || [];
        setCount(likedSongs.length);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedSongsCount();
  }, []);

  return { count, loading, error };
};