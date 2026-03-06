import { useState, useEffect } from 'react';
import { getAllUsers } from '@/lib/api/api-calls/admin_APIs/ad-users';

function extractUsersArray(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  const obj = payload as Record<string, unknown>;
  const candidate = obj.data ?? obj.users ?? obj.results;
  return Array.isArray(candidate) ? candidate : [];
}

export const usePremiumUsersCount = () => {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPremiumUsersCount = async () => {
      try {
        setLoading(true);
        const result = await getAllUsers();
        const users = extractUsersArray(result);
        const premiumUsersCount = users.filter((user) => {
          if (!user || typeof user !== 'object') return false;
          const role = (user as Record<string, unknown>).role;
          return role === 'pUser';
        }).length;
        setCount(premiumUsersCount);
        setError(null);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load premium users count');
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumUsersCount();
  }, []);

  return { count, loading, error };
};