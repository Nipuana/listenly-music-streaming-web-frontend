import { Heart, Music, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useUserStats } from "@/hooks/stats-hooks/use-user-stats";

export function StatsGrid() {
  const { stats } = useUserStats();

  const statsData = [
    { title: "Liked Songs", value: stats.likedSongs, icon: Heart, color: "text-secondary" },
    { title: "Playlists", value: stats.playlists, icon: Music, color: "text-primary" },
    { title: "Hours Listened", value: stats.hoursListened, icon: Clock, color: "text-secondary" },
    { title: "Following", value: 56, icon: User, color: "text-primary" }, // TODO: Implement following count
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 space-responsive">
      {statsData.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg hover:bg-card-hover transition-colors">
            <CardContent className="pt-6">
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
