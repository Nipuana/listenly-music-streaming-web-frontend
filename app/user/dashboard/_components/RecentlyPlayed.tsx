import { Play } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const recentSongs = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Luna Eclipse",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    title: "Summer Breeze",
    artist: "The Wanderers",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    title: "Urban Lights",
    artist: "City Beats",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    title: "Acoustic Soul",
    artist: "Sarah Mitchell",
    image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
  },
];

export function RecentlyPlayed() {
  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
      <CardHeader>
        <CardTitle>Recently Played</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recentSongs.map((song) => (
            <Card
              key={song.id}
              className="group border-border/50 hover:shadow-primary transition-all cursor-pointer overflow-hidden"
            >
              <CardContent className="p-4">
                <div className="relative mb-3">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={song.image}
                      alt={song.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <Button
                    size="icon"
                    className="absolute bottom-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-primary bg-gradient-primary"
                  >
                    <Play className="w-4 h-4 ml-0.5 fill-white" />
                  </Button>
                </div>
                <h4 className="font-semibold truncate">{song.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
