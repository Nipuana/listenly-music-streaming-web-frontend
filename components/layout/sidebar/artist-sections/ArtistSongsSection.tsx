"use client";

import { Music, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SongDetailsPopup } from "@/app/user/_components/popups/SongDetailsPopup";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// caching hook handles state; no local useEffect/useState needed
import { useMySongs } from "@/hooks/cashing-hooks/use-my-songs";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";

export default function ArtistSongsSection({ onCreateSong }: { onCreateSong?: () => void }) {
  const { songs: allSongs, loading } = useMySongs();

  const safeSongs = Array.isArray(allSongs) ? allSongs : [];
  const songs = safeSongs.slice(0, 3);
  const hasMore = safeSongs.length > 3;

  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openSong = (s: any) => {
    setSelectedSong(s);
    setIsOpen(true);
  };

  return (
    <div className="space-y-4 pt-4">
      <div className="px-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">My Songs</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
              title="Create song"
              onClick={onCreateSong}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button asChild variant="ghost" size="sm" className="p-0 h-6 w-6" title="Go to songs">
              <Link href="/artist/my-songs">
                <ChevronDown className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center py-2.5 px-3 rounded-lg">
                <div className="w-8 h-8 rounded-md bg-muted animate-pulse mr-3 shrink-0" />
                <div className="h-4 bg-muted rounded animate-pulse flex-1" />
              </div>
            ))
          ) : songs.length > 0 ? (
            <>
              {songs.map((s) => (
                <Button key={s.id} asChild variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary text-muted-foreground h-auto py-2.5 px-3 rounded-lg transition-colors">
                  <button type="button" onClick={() => openSong(s)} className="flex items-center w-full text-left">
                    <Image src={getSongCoverUrl(s.coverImageUrl || null)} alt={s.title} width={32} height={32} unoptimized className="w-8 h-8 rounded-md object-cover mr-3 shrink-0" />
                    <span className="text-sm font-medium truncate">{s.title}</span>
                  </button>
                </Button>
              ))}

              {hasMore && (
                <Button asChild variant="ghost" className="w-full justify-start hover:bg-primary/10 hover:text-primary text-muted-foreground h-auto py-2.5 px-3 rounded-lg transition-colors">
                  <Link href="/artist/my-songs" className="flex items-center">
                    <ChevronDown className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">Show all songs</span>
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No songs yet</p>
                <Button asChild variant="link" size="sm" className="h-auto p-0 mt-1 text-xs">
                <Link href="/artist/my-songs">Upload your first song</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      <SongDetailsPopup
        song={selectedSong}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPlay={() => {}}
      />
    </div>
  );
}
