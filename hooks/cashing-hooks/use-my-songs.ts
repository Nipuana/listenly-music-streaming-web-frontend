import { useState, useEffect, useCallback } from 'react';
import { getMySongs } from '@/lib/api/api-calls/user_APIs/song_APIs/songs';

interface Song {
  id: string;
  title: string;
  coverImageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

const transformSong = (apiSong: any): Song => ({
  ...apiSong,
  id: apiSong?._id || apiSong?.id,
  title: apiSong?.title || apiSong?.name || '',
  coverImageUrl: apiSong?.coverImageUrl || apiSong?.coverUrl || '',
});

const orderNewestFirst = (items: Song[]): Song[] => {
  const list = Array.isArray(items) ? items : [];
  if (list.length <= 1) return list;

  const getTime = (p: any) => {
    const raw = p?.updatedAt || p?.createdAt || p?.updated_at || p?.created_at || p?.date || p?.timestamp;
    if (!raw) return 0;
    const t = new Date(raw).getTime();
    return Number.isFinite(t) ? t : 0;
  };

  const hasTimestamp = list.some((p: any) => getTime(p) > 0);
  if (hasTimestamp) {
    return [...list].sort((a: any, b: any) => getTime(b) - getTime(a));
  }

  return [...list].reverse();
};

let songsCache: Song[] | null = null;
let songsLoading = false;
let songsError: string | null = null;
const listeners: ((songs: Song[], loading: boolean, error: string | null) => void)[] = [];

export const clearMySongsCache = () => {
  songsCache = null;
  songsLoading = false;
  songsError = null;
  listeners.forEach((l) => l([], false, null));
};

export const removeFromMySongsCache = (songId: string) => {
  if (!songId) return;
  if (!songsCache) return;
  songsCache = songsCache.filter((s) => s.id !== songId);
  listeners.forEach((l) => l(songsCache || [], false, songsError));
};

export const refetchMySongs = async () => {
  if (songsLoading) return;
  try {
    songsLoading = true;

    const data = await getMySongs();

    let items: any[] = [];
    if (Array.isArray(data)) items = data;
    else if (data && typeof data === 'object') items = data.data || data.items || data.songs || [];

    const transformed = orderNewestFirst(items.map(transformSong));

    songsCache = transformed;
    songsError = null;
    listeners.forEach((l) => l(transformed, false, null));
  } catch (err: any) {
    songsError = err?.message || String(err);
    songsCache = null;
    listeners.forEach((l) => l([], false, songsError));
  } finally {
    songsLoading = false;
  }
};

export const useMySongs = () => {
  const [songs, setSongs] = useState<Song[]>(songsCache || []);
  const [loading, setLoading] = useState<boolean>(!songsCache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const listener = (newSongs: Song[], newLoading: boolean, newError: string | null) => {
      setSongs(newSongs);
      setLoading(newLoading);
      setError(newError);
    };
    listeners.push(listener);

    if (songsCache) {
      setSongs(songsCache);
      setLoading(false);
      setError(songsError);
    }

    const fetchSongs = async () => {
      try {
        if (songsLoading) return;
        songsLoading = true;
        setLoading(true);

        const data = await getMySongs();

        let items: any[] = [];
        if (Array.isArray(data)) items = data;
        else if (data && typeof data === 'object') items = data.data || data.items || data.songs || [];

        const transformed = orderNewestFirst(items.map(transformSong));

        songsCache = transformed;
        songsError = null;

        setSongs(transformed);
        setError(null);
        listeners.forEach((l) => l(transformed, false, null));
      } catch (err: any) {
        songsError = err?.message || String(err);
        songsCache = null;

        setError(songsError);
        setSongs([]);
        listeners.forEach((l) => l([], false, songsError));
      } finally {
        songsLoading = false;
        setLoading(false);
      }
    };

    if (!songsCache && !songsLoading) {
      fetchSongs();
    }

    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, []);

  const refetch = useCallback(async () => {
    try {
      if (songsLoading) return;
      songsLoading = true;
      setLoading(true);

      const data = await getMySongs();

      let items: any[] = [];
      if (Array.isArray(data)) items = data;
      else if (data && typeof data === 'object') items = data.data || data.items || data.songs || [];

      const transformed = orderNewestFirst(items.map(transformSong));

      songsCache = transformed;
      songsError = null;

      setSongs(transformed);
      setError(null);
      listeners.forEach((l) => l(transformed, false, null));
    } catch (err: any) {
      songsError = err?.message || String(err);
      songsCache = null;

      setError(songsError);
      setSongs([]);
      listeners.forEach((l) => l([], false, songsError));
    } finally {
      songsLoading = false;
      setLoading(false);
    }
  }, []);

  return { songs, loading, error, refetch };
};
