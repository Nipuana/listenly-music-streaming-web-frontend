import { useState, useEffect } from 'react';

export const useHoursListened = () => {
  const [hours, setHours] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHoursListened = async () => {
      try {
        setLoading(true);
        // TODO: Implement API call to get total hours listened
        // For now, return 0 as placeholder
        setHours(0);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setHours(0);
      } finally {
        setLoading(false);
      }
    };

    fetchHoursListened();
  }, []);

  return { hours, loading, error };
};