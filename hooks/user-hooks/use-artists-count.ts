import { useState, useEffect } from 'react';
import { getAllUsers } from '@/lib/api/api-calls/admin_APIs/ad-users';

export const useArtistsCount = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArtistsCount = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();
        const artistsCount = users.filter((user: any) => user.role === 'artist').length;
        setCount(artistsCount);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchArtistsCount();
  }, []);

  return { count, loading, error };
};