"use client";

import { useState, useEffect } from "react";
import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";
import { SidebarLayout } from "@/components/layout/sidebar/SidebarLayout";
import { getMySongs } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
import { useAuth } from "@/Providers/Contexts/auth-context";
import Loading from "@/app/user/liked/loading";
import ArtistSongsGrid from "./_components/ArtistSongsGrid";
import { CreateSongPopup } from "../_components/popups/CreateSongPopup";
import Header from "@/components/layout/header";

export default function ArtistMySongsPage() {
  const { user, logout } = useAuth();
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMySongs();
        setSongs(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error('Failed to load my songs', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <SidebarProvider user={user}>
        <Header />
        <SidebarLayout mode="artist" user={user} onLogout={logout}>
          <Loading />
        </SidebarLayout>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider user={user}>
      <Header />
      <SidebarLayout mode="artist" user={user} onLogout={logout}>
        <div className="min-h-screen bg-linear-to-br from-background via-background-secondary to-background-tertiary transition-colors duration-300 max-w-7xl mx-auto space-y-6 md:space-y-8 py-6 md:py-8 lg:py-10 xl:py-12">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">My Songs</h1>
            <p className="text-muted-foreground">All your uploaded songs</p>
          </div>

          <ArtistSongsGrid songs={songs} onAdd={() => setIsCreateOpen(true)} onRefresh={async () => {
            try {
              const data = await getMySongs();
              setSongs(Array.isArray(data) ? data : data?.data || []);
            } catch (err) {
              console.error('Failed to reload my songs', err);
            }
          }} />
          <CreateSongPopup
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
            onSuccess={async () => {
              try {
                const data = await getMySongs();
                setSongs(Array.isArray(data) ? data : data?.data || []);
              } catch (err) {
                console.error("Failed to reload my songs", err);
              }
            }}
          />
        </div>
      </SidebarLayout>
    </SidebarProvider>
  );
}
