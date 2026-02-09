"use client";

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";
import { SidebarLayout } from "@/components/layout/sidebar/SidebarLayout";
import { getLikedSongs } from "@/lib/api/api-calls/user_APIs/song_APIs/song-likes";
import { useAuth } from "@/Providers/Contexts/auth-context";
import Loading from "../liked/loading";
import { MyLikesHeader } from "./_components/MyLikesHeader";
import { LikedSongsGrid } from "./_components/LikedSongsGrid";
import { NoLikedSongsAlert } from "./_components/NoLikedSongsAlert";
import { LikedSongsOverview } from "./_components/LikedSongsOverview";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; [key: string]: unknown };
}

export default function MyLikesPage() {
  const { user } = useAuth();
  const [likedSongs, setLikedSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const userName =
    user?.name ||
    user?.username ||
    user?.userName ||
    user?.fullName ||
    user?.email?.split("@")[0] ||
    "Listenly User";

  useEffect(() => {
    const loadLikedSongs = async () => {
      try {
        const data = await getLikedSongs();
        setLikedSongs(Array.isArray(data) ? data : data?.data || []);
      } catch (error) {
        console.error('Failed to load liked songs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLikedSongs();
  }, []);

  if (loading) {
    return (
      <SidebarProvider>
        <SidebarLayout mode="user">
          <Loading />
        </SidebarLayout>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <SidebarLayout mode="user">
        <div className="min-h-screen bg-linear-to-br from-background via-background-secondary to-background-tertiary transition-colors duration-300">
          <div className="app-container py-6 md:py-8 lg:py-10 xl:py-12 space-y-6 md:space-y-8">
            <MyLikesHeader userName={userName} songCount={likedSongs.length} />

            <LikedSongsGrid songs={likedSongs} />

            {likedSongs.length === 0 && <NoLikedSongsAlert />}

            <LikedSongsOverview songs={likedSongs} />
          </div>
        </div>
      </SidebarLayout>
    </SidebarProvider>
  );
}