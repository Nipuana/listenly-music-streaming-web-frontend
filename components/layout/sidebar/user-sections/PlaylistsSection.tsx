"use client";
import { Music, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const playlists = [
  { name: "Chill Vibes", id: "chill-vibes" },
  { name: "Workout Mix", id: "workout-mix" },
  { name: "Study Sessions", id: "study-sessions" },
];

export function PlaylistsSection() {
  return (
    <div className="space-y-4 pt-4">
      <div className="px-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            My Playlists
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
            title="Create new playlist"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-1">
          {playlists.map((playlist) => (
            <Button
              key={playlist.id}
              asChild
              variant="ghost"
              className="w-full justify-start hover:bg-primary/10 hover:text-primary text-muted-foreground h-auto py-2.5 px-3 rounded-lg transition-colors"
            >
              <Link href={`/user/playlist/${playlist.id}`} className="flex items-center">
                <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center mr-3 shrink-0">
                  <Music className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium truncate">{playlist.name}</span>
              </Link>
            </Button>
          ))}
        </div>

        {playlists.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No playlists yet</p>
            <Button variant="link" size="sm" className="h-auto p-0 mt-1 text-xs">
              Create your first playlist
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}