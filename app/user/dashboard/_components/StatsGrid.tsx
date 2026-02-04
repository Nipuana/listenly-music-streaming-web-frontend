import { Heart, Music, Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { title: "Liked Songs", value: 247, icon: Heart, color: "text-secondary" },
  { title: "Playlists", value: 12, icon: Music, color: "text-primary" },
  { title: "Hours Listened", value: 342, icon: Clock, color: "text-secondary" },
  { title: "Following", value: 56, icon: User, color: "text-primary" },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg hover:bg-card-hover transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <Icon className={`w-10 h-10 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
