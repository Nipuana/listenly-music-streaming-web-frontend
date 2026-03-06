import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

interface PlaylistCardProps {
  playlist: Playlist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  const coverUrl = getPlaylistCoverUrl(playlist.coverUrl);
  
  return (
    <Link href={`/user/playlist/${playlist.id}`}>
      <Card className="border-border/50 hover:shadow-primary transition-all cursor-pointer group">
        <CardContent className="card-responsive">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted mb-3 group-hover:scale-105 transition-transform">
            <img
              src={coverUrl}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="font-semibold text-responsive-sm truncate">{playlist.name}</h4>
          <p className="text-sm text-muted-foreground">{playlist.trackCount} songs</p>
        </CardContent>
      </Card>
    </Link>
  );
}