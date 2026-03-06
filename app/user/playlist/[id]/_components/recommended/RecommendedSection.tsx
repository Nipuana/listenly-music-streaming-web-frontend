"use client";

import { useMemo } from "react";
import { shuffleArray } from "../utils/utils";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";
import { isPlaylistPublic } from "@/lib/utils/playlist-visibility";
import { useAllPlaylists } from "@/hooks/cashing-hooks/use-all-playlists";

// component fetches all playlists once and shows a few random ones in dashboard grid style
export function RecommendedSection() {
  const { playlists: allPlaylists } = useAllPlaylists();

  const playlists = useMemo(() => {
    if (!allPlaylists?.length) return [];
    const publicOnly = allPlaylists.filter(isPlaylistPublic);
    const shuffled = shuffleArray(publicOnly);
    return shuffled.slice(0, 4);
  }, [allPlaylists]);

  if (playlists.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Recommended for you</h2>
      <div className="grid-responsive-auto">
        {playlists.map((pl) => (
          <Link key={(pl as any).id} href={`/user/playlist/${(pl as any).id}`}> 
            <Card className="border-border/50 hover:shadow-primary transition-all cursor-pointer">
              <CardContent className="card-responsive">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                  <Image
                    src={getPlaylistCoverUrl((pl as any).coverUrl || (pl as any).coverImageUrl || "")}
                    alt={(pl as any).name}
                    width={300}
                    height={300}
                    unoptimized={true}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-semibold text-responsive-sm">{(pl as any).name}</h4>
                <p className="text-sm text-muted-foreground">{(pl as any).trackCount || (pl as any).songCount || 0} songs</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
