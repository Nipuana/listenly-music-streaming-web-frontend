"use client";

import { useState, useEffect } from "react";
import { getAllPlaylists } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlists";
import { shuffleArray } from "../utils/utils";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";

// component fetches all playlists once and shows a few random ones in dashboard grid style
export function RecommendedSection() {
  const [playlists, setPlaylists] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data: any = await getAllPlaylists();
        const allLists = Array.isArray(data) ? data : data?.data || [];
        if (mounted && Array.isArray(allLists) && allLists.length > 0) {
          const shuffled = shuffleArray(allLists);
          setPlaylists(shuffled.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch recommended playlists", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (playlists.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recommended for you</h2>
      <div className="grid-responsive-auto">
        {playlists.map((pl) => (
          <Link key={pl.id} href={`/user/playlist/${pl.id}`}> 
            <Card className="border-border/50 hover:shadow-primary transition-all cursor-pointer">
              <CardContent className="card-responsive">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                  <Image
                    src={getPlaylistCoverUrl(pl.coverUrl || pl.coverImageUrl || "")}
                    alt={pl.name}
                    width={300}
                    height={300}
                    unoptimized={true}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-responsive-sm">{pl.name}</h4>
                <p className="text-sm text-muted-foreground">{pl.trackCount || pl.songCount || 0} songs</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
