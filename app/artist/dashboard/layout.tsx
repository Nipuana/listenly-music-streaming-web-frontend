
import React from "react";
import Header from "@/components/layout/header";
import { SidebarLayout } from "@/components/layout/sidebar/SidebarLayout";
import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";

export const metadata = {
  title: 'Artist',
};

export default function ArtistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Artist" />
      <SidebarProvider>
        <SidebarLayout mode="artist" className="p-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </SidebarLayout>
      </SidebarProvider>
    </div>
  );
}
