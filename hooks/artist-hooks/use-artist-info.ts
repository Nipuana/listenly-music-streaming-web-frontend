import { useState, useEffect } from 'react';
import { getUserById } from '@/lib/api/api-calls/admin_APIs/ad-users';

interface ArtistInfo {
  id: string;
  name: string;
  username: string;
  profilePicture?: string;
  profilePicUrl?: string;
  profile_pic?: string;
}

// Global cache for artist info to avoid duplicate requests
const artistCache = new Map<string, ArtistInfo>();
const loadingCache = new Map<string, boolean>();

export const useArtistInfo = (userId?: string) => {
  const [artist, setArtist] = useState<ArtistInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: any) => {
      try {
        const updatedUser = e?.detail?.user;
        if (!updatedUser) return;
        if (!userId) return;
        if (String(updatedUser.id || updatedUser._id) === String(userId)) {
          // update cache and local state
          artistCache.set(userId, updatedUser);
          setArtist(updatedUser);
        }
      } catch (err) {
        // ignore
      }
    };

    window.addEventListener("profileUpdated", handler as EventListener);
    return () => window.removeEventListener("profileUpdated", handler as EventListener);
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setArtist(null);
      return;
    }

    // Check if we already have this artist cached
    if (artistCache.has(userId)) {
      setArtist(artistCache.get(userId)!);
      setLoading(false);
      return;
    }

    // Check if we're already loading this artist
    if (loadingCache.get(userId)) {
      // Wait for the existing request to complete
      const checkCache = () => {
        if (artistCache.has(userId)) {
          setArtist(artistCache.get(userId)!);
          setLoading(false);
        } else {
          setTimeout(checkCache, 100);
        }
      };
      checkCache();
      return;
    }

    const fetchArtist = async () => {
      try {
        setLoading(true);
        loadingCache.set(userId, true);

        const artistData = await getUserById(userId);

        // Cache the result
        artistCache.set(userId, artistData.data);
        loadingCache.set(userId, false);

        setArtist(artistData.data);
        setError(null);
      } catch (err: any) {
        loadingCache.set(userId, false);
        setError(err.message);
        setArtist(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [userId]);

  return { artist, loading, error };
};