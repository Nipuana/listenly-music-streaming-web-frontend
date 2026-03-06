import { Heart, Music } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLikedSongsCount } from "@/hooks/stats-hooks/use-liked-songs-count";
import { useFavoritedPlaylistsCount } from "@/hooks/stats-hooks/use-favorited-playlists-count";

export function StatsGrid() {
  const { count: likedCount = 0, loading: likedLoading } = useLikedSongsCount();
  const { count: favoritedCount = 0, loading: favoritedLoading } = useFavoritedPlaylistsCount();
  const loading = likedLoading || favoritedLoading;

  const statsData = [
    { title: "Liked Songs", value: loading ? "—" : likedCount.toLocaleString(), icon: Heart },
    { title: "Favorited Playlists", value: loading ? "—" : favoritedCount.toLocaleString(), icon: Music },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 space-responsive">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg hover:bg-card-hover transition-colors">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-responsive-2xl font-bold">{stat.value}</p>
                </div>
                <Icon className="w-8 h-8 md:w-10 md:h-10 text-secondary" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
