"use client";
import { Music, Home, Library, Heart, TrendingUp, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { useAuth } from "../../(auth)/context/auth-context";

const playlists = [
  { name: "Chill Vibes", id: "chill-vibes" },
  { name: "Workout Mix", id: "workout-mix" },
  { name: "Study Sessions", id: "study-sessions" },
];

export function UserSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-card/60 backdrop-blur-md p-6 border-r hidden md:block overflow-y-auto">
      <nav className="space-y-2">
        <Button
          asChild
          className={`w-full justify-start ${
            pathname === "/user/dashboard"
              ? "bg-[linear-gradient(to_right,var(--primary),var(--secondary))] text-white"
              : "bg-transparent hover:bg-accent"
          }`}
          variant={pathname === "/user/dashboard" ? "default" : "ghost"}
        >
          <Link href="/user/dashboard">
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
        </Button>

        <Button asChild variant="ghost" className="w-full justify-start hover:bg-accent">
          <Link href="/user/library">
            <Library className="w-5 h-5 mr-3" />
            Library
          </Link>
        </Button>

        <Button asChild variant="ghost" className="w-full justify-start hover:bg-accent">
          <Link href="/user/liked">
            <Heart className="w-5 h-5 mr-3" />
            Liked Songs
          </Link>
        </Button>

        <Button asChild variant="ghost" className="w-full justify-start hover:bg-accent">
          <Link href="/user/trending">
            <TrendingUp className="w-5 h-5 mr-3" />
            Trending
          </Link>
        </Button>

        <Separator className="my-6" />

        <div>
          <h3 className="px-4 text-xs text-muted-foreground mb-3 uppercase tracking-wider">
            My Playlists
          </h3>
          {playlists.map((playlist) => (
            <Button
              key={playlist.id}
              asChild
              variant="ghost"
              className="w-full justify-start hover:bg-accent h-auto py-2"
            >
              <Link href={`/user/playlist/${playlist.id}`}>
                <Music className="w-4 h-4 mr-3" />
                <span className="text-sm">{playlist.name}</span>
              </Link>
            </Button>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="space-y-2">
          <Button asChild variant="ghost" className="w-full justify-start hover:bg-accent">
            <Link href="/user/feedback">
              <Settings className="w-5 h-5 mr-3" />
              Feedback
            </Link>
          </Button>

          <Button
            onClick={logout}
            variant="ghost"
            className="w-full justify-start hover:bg-destructive/10 text-destructive hover:text-destructive"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </nav>
    </aside>
  );
}
