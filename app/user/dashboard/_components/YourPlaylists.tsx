import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const playlists = [
  {
    id: 1,
    name: "Chill Vibes",
    songs: 45,
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Workout Mix",
    songs: 32,
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Study Sessions",
    songs: 28,
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
  },
];

export function YourPlaylists() {
  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Playlists</CardTitle>
          <Button asChild variant="link" className="text-secondary p-0">
            <Link href="/user/playlists">View All</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playlists.map((playlist) => (
            <Link key={playlist.id} href={`/user/playlist/${playlist.id}`}>
              <Card className="border-border/50 hover:shadow-lg transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted mb-3">
                    <Image
                      src={playlist.image}
                      alt={playlist.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <h4 className="font-semibold">{playlist.name}</h4>
                  <p className="text-sm text-muted-foreground">{playlist.songs} songs</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
