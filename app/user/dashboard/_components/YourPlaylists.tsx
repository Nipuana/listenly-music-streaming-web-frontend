import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useMyPlaylists } from "@/hooks/cashing-hooks/use-my-playlists";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";

export function YourPlaylists({ collapsed = false }: { collapsed?: boolean }) {
  const { playlists, loading, error } = useMyPlaylists();

  if (loading) {
    return (
      <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Playlists</CardTitle>
            <Button asChild variant="link" className="p-0">
              <Link href="/user/playlist">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid-responsive-auto">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="border-border/50">
                <CardContent className="card-responsive">
                  <Skeleton className="w-full aspect-square rounded-lg mb-3" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Your Playlists</CardTitle>
            <Button asChild variant="link" className="p-0">
              <Link href="/user/playlist">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Failed to load playlists</p>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Ensure playlists is an array before mapping
  const playlistsArray = Array.isArray(playlists) ? playlists : [];
  
  // Show only first 3 playlists in dashboard
  const displayedPlaylists = playlistsArray.slice(0, 3);
  const hasMorePlaylists = playlistsArray.length > 3;

  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Playlists</CardTitle>
          <Button asChild variant="link" className="p-0">
            <Link href="/user/playlist">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid-responsive-auto">
          {playlistsArray.length > 0 ? (
            displayedPlaylists.map((playlist) => (
              <Link key={playlist.id} href={`/user/playlist/${playlist.id}`}>
                <Card className="border-border/50 hover:shadow-primary transition-all cursor-pointer">
                  <CardContent className="card-responsive">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                      <Image
                        src={getPlaylistCoverUrl(playlist.coverUrl)}
                        alt={playlist.name}
                        width={300}
                        height={300}
                        unoptimized={true}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-responsive-sm">{playlist.name}</h4>
                    <p className="text-sm text-muted-foreground">{playlist.trackCount} songs</p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No playlists yet</p>
              <Button asChild variant="outline" className="mt-2">
                <Link href="/user/playlists">Create your first playlist</Link>
              </Button>
            </div>
          )}
        </div>
        
        {hasMorePlaylists && (
          <div className="flex justify-center mt-6">
            <Button asChild variant="outline" className="hover:bg-primary/5 hover:border-primary/50 transition-colors">
              <Link href="/user/playlists" className="flex items-center gap-2">
                <span>Show all playlists</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  +{playlistsArray.length - 3}
                </span>
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
