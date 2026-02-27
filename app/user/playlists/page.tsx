"use client";

import Header from "@/components/layout/header";
import { PlaylistsClient } from "./_components/PlaylistsClient";
import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";
import { useAuth } from "@/Providers/Contexts/auth-context";

export default function PlaylistsPage() {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider user={user}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <PlaylistsClient />
      </div>
    </SidebarProvider>
  );
}