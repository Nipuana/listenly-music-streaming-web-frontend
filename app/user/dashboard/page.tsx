"use client";

import Header from "@/components/layout/header";
import { DashboardClient } from "./_components/DashboardClient";
import { SidebarProvider } from "@/Providers/Contexts/SidebarContext";
import { useAuth } from "@/Providers/Contexts/auth-context";

export default function DashboardPage() {
  
  const { user } = useAuth();
  return (
    <SidebarProvider user={user}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <DashboardClient />
      </div>
    </SidebarProvider>
  );
}
