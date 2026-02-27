"use client";

import { useState, useEffect } from "react";
import { AnimatedPopup } from "@/lib/utils/animated-popup";
import { Music } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// static songs for UI mode
import type { Song } from "@/app/user/liked/utils/handlers";

interface AddSongPopupProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  existingSongIds?: string[];
  onAdd?: (song: Song) => void;
}

export function AddSongPopup({
  isOpen,
  onClose,
  playlistId,
  existingSongIds = [],
  onAdd,
}: AddSongPopupProps) {
  const [songs, setSongs] = useState<Song[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);

  // load a fixed list of sample songs when opened
  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    setTimeout(() => {
      setSongs([
        { id: "song1", title: "First Song", artist: "Artist A", duration: "210000", genre: "Pop", coverImageUrl: "", audioUrl: "/uploads/audio/demo1.mp3" },
        { id: "song2", title: "Second Song", artist: "Artist B", duration: "180000", genre: "Rock", coverImageUrl: "", audioUrl: "/uploads/audio/demo2.mp3" },
        { id: "song3", title: "Third Song", artist: "Artist C", duration: "240000", genre: "Jazz", coverImageUrl: "", audioUrl: "/uploads/audio/demo3.mp3" },
      ]);
      setLoading(false);
    }, 300);
  }, [isOpen]);

  const filtered = songs.filter((s) =>
    (!existingSongIds.length || !(existingSongIds.includes(s.id || (s as any)._id))) &&
    (s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.artist?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = (song: Song) => {
    const id = song.id || (song as any)._id;
    if (!id) return;
    setAddingId(id);
    // simulate success
    setTimeout(() => {
      setAddingId(null);
      onAdd?.(song);
    }, 300);
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
        <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2 mb-4">
          <Music className="w-6 h-6" /> Add Song
        </h2>
        <Input
          placeholder="Search songs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 bg-card border-border focus:border-primary"
        />
        <div className="max-h-64 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center py-4">Loading songs...</div>
          ) : filtered.length > 0 ? (
            filtered.map((s) => {
              const sid = s.id || (s as any)._id || "";
              return (
                <div key={sid} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent transition-colors">
                  <div className="truncate">
                    {s.title} - {s.artist}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAdd(s)}
                    disabled={addingId === sid}
                  >
                    {addingId === sid ? "Adding..." : "Add"}
                  </Button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4 text-muted-foreground">No songs found</div>
          )}
        </div>
        <div className="mt-4 text-right">
          <Button onClick={onClose} variant="outline" className="border-border hover:bg-accent">
            Close
          </Button>
        </div>
      </div>
    </AnimatedPopup>
  );
}
