"use client";
import { useAuth } from "../../../../Providers/Contexts/auth-context";
import Sidebar from "../../../../components/layout/sidebar/sidebar";
import { SidebarProvider, useSidebarState } from "../../../../Providers/Contexts/SidebarContext";
import { WelcomeBanner } from "./WelcomeBanner";
import { StatsGrid } from "./StatsGrid";
import { RecentlyPlayed } from "./RecentlyPlayed";
import { YourPlaylists } from "./YourPlaylists";
import { motion } from "framer-motion";

export function DashboardClient() {
  const { user, logout } = useAuth();
  const { collapsed } = useSidebarState();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-linear-to-br from-background via-background-secondary to-background-tertiary">
        <Sidebar activeTab="" setActiveTab={() => {}} user={user} onLogout={logout} mode="user" />

        <div style={{ marginLeft: collapsed ? '64px' : '256px' }} className="transition-all duration-300 ease-in-out">
          <MainContent user={user} />
        </div>
      </div>
    </SidebarProvider>
  );
}

function MainContent({ user }: { user: any }) {
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
