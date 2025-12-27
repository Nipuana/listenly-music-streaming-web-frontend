import { Music, BarChart2, Heart, TrendingUp, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const playlists = [
  { name: "Chill Vibes" },
  { name: "Workout Mix" },
  { name: "Study Sessions" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-background p-6 flex flex-col gap-6 border-r border-border">
        <nav className="flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 rounded-xl font-semibold text-primary bg-gradient-primary shadow-sm">
            <BarChart2 className="w-5 h-5" /> Dashboard
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-xl text-foreground hover:bg-accent/30">
            <BarChart2 className="w-5 h-5" /> Library
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-xl text-foreground hover:bg-accent/30">
            <Heart className="w-5 h-5" /> Liked Songs
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-2 rounded-xl text-foreground hover:bg-accent/30">
            <TrendingUp className="w-5 h-5" /> Trending
          </Link>
        </nav>
        <hr className="my-2 border-border" />
        <div>
          <div className="text-xs text-muted-foreground mb-2 font-semibold tracking-wide">MY PLAYLISTS</div>
          <ul className="flex flex-col gap-2">
            {playlists.map((playlist) => (
              <li key={playlist.name} className="flex items-center gap-3 px-4 py-1 text-foreground">
                <Music className="w-4 h-4" /> {playlist.name}
              </li>
            ))}
          </ul>
        </div>
        <hr className="my-2 border-border" />
        <nav className="flex flex-col gap-2 mt-auto">
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-xl text-foreground hover:bg-accent/30">
            <Settings className="w-5 h-5" /> Feedback
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-xl text-foreground hover:bg-accent/30">
            <LogOut className="w-5 h-5" /> Logout
          </a>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center">
        <div className="text-2xl text-muted-foreground">Welcome to your Dashboard!</div>
      </main>
    </div>
  );
}
