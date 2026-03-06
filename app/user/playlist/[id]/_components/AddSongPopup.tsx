"use client";

import { useState, useEffect, useMemo } from "react";
import { AnimatedPopup } from "@/lib/utils/animated-popup";
import { Music, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/app/user/liked/utils/formatting-utils";
import { getAllSongs } from '@/lib/api/api-calls/user_APIs/song_APIs/songs';
import { getSongCoverUrl } from '@/hooks/media-hooks/get-song-cover';
// static songs for UI mode
import type { Song } from "@/app/user/liked/utils/handlers";
import { addSongToPlaylist } from '@/lib/api/api-calls/user_APIs/playlist_APIs/playlists';
import { toast } from 'react-toastify';

interface AddSongPopupProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  playlistName?: string;
  existingSongIds?: string[];
  onAdd?: (song: Song) => void;
}

export function AddSongPopup({
  isOpen,
  onClose,
  playlistId,
  playlistName,
  existingSongIds = [],
  onAdd,
}: AddSongPopupProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // load user's songs when popup opens
  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await getAllSongs();
        const list = Array.isArray(data) ? data : data?.data || [];
        if (!mounted) return;
        setSongs(list as any[]);
      } catch (err: any) {
        console.error('Failed to load songs', err);
        toast.error(err?.message || 'Failed to load songs');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [isOpen]);

  const filtered = useMemo(() => songs.filter((s) =>
    (!existingSongIds.length || !(existingSongIds.includes(s.id || (s as any)._id))) &&
    (s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.artist?.toLowerCase().includes(search.toLowerCase()))
  ), [songs, existingSongIds, search]);

  const handleAdd = (song: Song) => {
    const id = song.id || (song as any)._id;
    if (!id) return;
    (async () => {
      setAddingId(id);
      try {
        await addSongToPlaylist(playlistId, id);
        toast.success("Song added to playlist");
        onAdd?.(song);
      } catch (err: any) {
        console.error('Failed to add song to playlist', err);
        toast.error(err?.message || 'Failed to add song to playlist');
      } finally {
        setAddingId(null);
      }
    })();
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAddSelected = async () => {
    if (!selectedIds.size) return;
    const selected = songs.filter(s => selectedIds.has(s.id || (s as any)._id || ""));
    for (const s of selected) {
      const sid = s.id || (s as any)._id || null;
      if (!sid) continue;
      setAddingId(sid);
      try {
        // eslint-disable-next-line no-await-in-loop
        await addSongToPlaylist(playlistId, sid);
        toast.success(`Added ${s.title} to playlist`);
        onAdd?.(s);
      } catch (err: any) {
        console.error('Failed to add song to playlist', err);
        toast.error(err?.message || `Failed to add ${s.title}`);
      } finally {
        setAddingId(null);
      }
    }
    setSelectedIds(new Set());
    onClose();
  };

  return (
    <AnimatedPopup isOpen={isOpen} onClose={onClose} className="relative bg-background rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
      >
        ✕
      </button>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Music className="w-6 h-6" /> Add Songs to Playlist
            </h2>
            <div className="text-sm text-muted-foreground mt-1">
              Select songs from your library to add to {playlistName ? `"${playlistName}"` : "this playlist"}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search songs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-4 py-3 rounded-lg border-2 border-primary/30"
            />
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto border border-border rounded-lg">
          {loading ? (
            <div className="text-center py-6">Loading songs...</div>
          ) : filtered.length > 0 ? (
            filtered.map((s) => {
              const sid = s.id || (s as any)._id || "";
              const isChecked = selectedIds.has(sid);
              return (
                <div key={sid} className="flex items-center justify-between py-3 px-3 hover:bg-accent transition-colors">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleSelect(sid)}
                      className="w-4 h-4"
                    />
                    <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={getSongCoverUrl((s as any).coverImageUrl || (s as any).cover || (s as any).coverImage || null)} alt={s.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium truncate">{s.title}</div>
                      <div className="text-sm text-muted-foreground truncate">{s.artist}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{(s as any).album || ''}</div>
                    <div className="text-sm">{formatDuration(parseInt(s.duration || '0'))}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-muted-foreground">No songs found</div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{selectedIds.size} selected</div>
          <div className="flex items-center gap-3">
            <Button onClick={onClose} variant="outline" className="border-border hover:bg-accent">
              Cancel
            </Button>
            <Button onClick={handleAddSelected} disabled={selectedIds.size === 0} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Song(s)
            </Button>
          </div>
        </div>
      </div>
    </AnimatedPopup>
  );
}
