import { useState, useEffect } from 'react';
import { getAllUsers } from '@/lib/api/api-calls/admin_APIs/ad-users';

export interface AllUserRoleCounts {
  total: number;
  regularUsers: number;
  premiumUsers: number;
  artists: number;
  admins: number;
}

export const useAllUserRoleCounts = () => {
  const [counts, setCounts] = useState<AllUserRoleCounts>({
    total: 0,
    regularUsers: 0,
    premiumUsers: 0,
    artists: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllUserRoleCounts = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();

        const roleCounts = users.reduce((acc: AllUserRoleCounts, user: any) => {
          acc.total++;
          switch (user.role) {
            case 'user':
              acc.regularUsers++;
              break;
            case 'pUser':
              acc.premiumUsers++;
              break;
            case 'artist':
              acc.artists++;
              break;
            case 'admin':
              acc.admins++;
              break;
            default:
              acc.regularUsers++; // Default to regular user if role is unknown
              break;
          }
          return acc;
        }, {
          total: 0,
          regularUsers: 0,
          premiumUsers: 0,
          artists: 0,
          admins: 0,
        });

        setCounts(roleCounts);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setCounts({
          total: 0,
          regularUsers: 0,
          premiumUsers: 0,
          artists: 0,
          admins: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllUserRoleCounts();
  }, []);

  return { counts, loading, error };
};