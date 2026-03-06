"use client";

import Header from "@/components/layout/header";
import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";
import { ArtistProfileDashboard } from "./_components/ArtistProfileDashboard";

export default function Page() {
  return (
    <SidebarProvider>
      <Header />
      <ArtistProfileDashboard />
    </SidebarProvider>
  );
}
