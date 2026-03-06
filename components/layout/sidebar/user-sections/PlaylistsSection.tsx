"use client";
import { Music, Plus, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMyPlaylists } from "@/hooks/cashing-hooks/use-my-playlists";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";

export function PlaylistsSection({ onCreatePlaylist }: { onCreatePlaylist?: () => void }) {
  const { playlists, loading } = useMyPlaylists();
  const { user } = useAuth();

  const safePlaylists = Array.isArray(playlists) ? playlists : [];

  const displayedPlaylists = safePlaylists.slice(0, 3);
  const hasMorePlaylists = safePlaylists.length > 3;

  return (
    <div className="space-y-4 pt-4">
      <div className="px-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            My Playlists
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-primary/10 hover:text-primary"
                title="Create or manage playlists"
                disabled={loading}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/user/playlists" className="flex items-center">
                  <Music className="w-4 h-4 mr-3" />
                  <span>Go to playlists</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={onCreatePlaylist}
                className="flex items-center"
              >
                <Plus className="w-4 h-4 mr-3" />
                <span>Create playlist</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-1">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center py-2.5 px-3 rounded-lg">
                <div className="w-8 h-8 rounded-md bg-muted animate-pulse mr-3 shrink-0" />
                <div className="h-4 bg-muted rounded animate-pulse flex-1" />
              </div>
            ))
          ) : displayedPlaylists.length > 0 ? (
            <>
              {displayedPlaylists.map((playlist) => (
                <Button
                  key={playlist.id}
                  asChild
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary/10 hover:text-primary text-muted-foreground h-auto py-2.5 px-3 rounded-lg transition-colors"
                >
                  <Link href={`/user/playlist/${playlist.id}`} className="flex items-center">
                    <Image
                      src={getPlaylistCoverUrl(playlist.coverUrl)}
                      alt={playlist.name}
                      width={32}
                      height={32}
                      unoptimized={true}
                      className="w-8 h-8 rounded-md object-cover mr-3 shrink-0"
                    />
                    <span className="text-sm font-medium truncate">{playlist.name}</span>
                  </Link>
                </Button>
              ))}

              {hasMorePlaylists && (
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start hover:bg-primary/10 hover:text-primary text-muted-foreground h-auto py-2.5 px-3 rounded-lg transition-colors"
                >
                  <Link href="/user/playlists" className="flex items-center">
                    <ChevronDown className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">Show all playlists</span>
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Music className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-xs">No playlists yet</p>
              <Button 
                variant="link" 
                size="sm" 
                className="h-auto p-0 mt-1 text-xs" 
                onClick={onCreatePlaylist}
              >
                Create your first playlist
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}