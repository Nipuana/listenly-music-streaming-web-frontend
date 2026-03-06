"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useMySongs } from "@/hooks/cashing-hooks/use-my-songs";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";
import { SongDetailsPopup } from "@/app/user/_components/popups/SongDetailsPopup";

export function ArtistRecentUploads() {
  const { songs: allSongs = [], loading } = useMySongs() as any;
  const songs = Array.isArray(allSongs) ? allSongs.slice(0, 3) : [];

  const [selectedSong, setSelectedSong] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openSong = (s: any) => {
    setSelectedSong(s);
    setIsOpen(true);
  };

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Recently Uploaded</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading...</p>
            ) : songs.length === 0 ? (
              <p className="text-muted-foreground">No uploads yet.</p>
            ) : (
              <div className="space-y-3">
                {songs.map((s: any) => (
                  <button key={s.id} onClick={() => openSong(s)} className="w-full text-left flex items-center gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                      {s.cover && (
                        <Image src={getSongCoverUrl(s.cover)} alt={s.title} width={48} height={48} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm text-muted-foreground">{s.genre || "—"}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <SongDetailsPopup
        song={selectedSong}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPlay={() => {}}
      />
    </>
  );
}
