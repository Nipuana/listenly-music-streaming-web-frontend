import { useState, useEffect } from 'react';
import { getAllUsers } from '@/lib/api/api-calls/admin_APIs/ad-users';

export const usePremiumUsersCount = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPremiumUsersCount = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();
        const premiumUsersCount = users.filter((user: any) => user.role === 'pUser').length;
        setCount(premiumUsersCount);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumUsersCount();
  }, []);

  return { count, loading, error };
};