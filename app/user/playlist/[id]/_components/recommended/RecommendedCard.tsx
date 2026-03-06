"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import type { Song } from "@/app/user/liked/utils/handlers";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";

interface RecommendedCardProps {
  song: Song;
}

export function RecommendedCard({ song }: RecommendedCardProps) {
  const coverUrl = getSongCoverUrl(song.coverImageUrl || "");
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Image
          src={coverUrl}
          alt={song.title || "Recommendation"}
          width={300}
          height={300}
          className="w-full h-full object-cover rounded-lg"
          unoptimized={true}
        />
        <div className="p-3">
          <h3 className="font-semibold truncate">{song.title || "Unknown"}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
