"use client";
import { useAuth } from "../../../../Providers/Contexts/auth-context";
import { SidebarLayout } from "../../../../components/layout/sidebar/SidebarLayout";
import { PlaylistGrid } from "./PlaylistGrid";
import { motion } from "framer-motion";

export function PlaylistsClient() {
  const { user, logout } = useAuth();

  return (
    <SidebarLayout mode="user">
      <MainContent />
    </SidebarLayout>
  );
}

function MainContent() {
  return (
    <main className="overflow-auto min-h-screen">
      <motion.div
        className="app-container space-y-8 max-w-7xl mx-auto px-4 md:px-6 lg:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">My Playlists</h1>
          <p className="text-muted-foreground">Create and manage your music playlists</p>
        </div>
        <PlaylistGrid />
      </motion.div>
    </main>
  );
}