"use client";
import { useAuth } from "../../../../Providers/Contexts/auth-context";
import { SidebarProvider } from "../../../../Providers/Contexts/SidebarContext";
import { SidebarLayout } from "../../../../components/layout/sidebar/SidebarLayout";
import { WelcomeBanner } from "./WelcomeBanner";
import { StatsGrid } from "./StatsGrid";
import { RecentlyPlayed } from "./RecentlyPlayed-sections/RecentlyPlayed";
import { YourPlaylists } from "./YourPlaylists";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { getLikedSongs } from "@/lib/api/api-calls/user_APIs/song_APIs/song-likes";
import { likeStatusCache } from "@/hooks/cashing-hooks/use-song-like-status";

export function DashboardClient() {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider user={user}>
      <SidebarLayout mode="user" onLogout={logout}>
        <MainContent user={user} />
      </SidebarLayout>
    </SidebarProvider>
  );
}

function MainContent({ user }: { user: any }) {
  // Pre-populate like status cache with liked songs
  useEffect(() => {
    const loadLikedSongs = async () => {
      try {
        const likedSongsData = await getLikedSongs();
        // Populate the cache with liked song IDs
        const likedSongs = Array.isArray(likedSongsData) ? likedSongsData : likedSongsData?.data || [];
        likedSongs.forEach((song: any) => {
          if (song?.id || song?._id) {
            likeStatusCache.set(song.id || song._id, true);
          }
        });
      } catch (error) {
        console.error('Failed to load liked songs for cache:', error);
      }
    };

    loadLikedSongs();
  }, []);

  return (
    <main className="overflow-auto min-h-screen p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="app-container space-y-8 max-w-7xl mx-20px">
        <WelcomeBanner userName={user?.name || "Alex"} />
        <StatsGrid />
        <RecentlyPlayed collapsed={false} />
        <YourPlaylists collapsed={false} />
      </div>
    </main>
  );
}
