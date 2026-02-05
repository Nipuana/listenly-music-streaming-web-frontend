"use client";
import { useAuth } from "../../../(auth)/context/auth-context";
import Sidebar from "../../../../components/layout/sidebar/sidebar";
import { SidebarProvider, useSidebarState } from "../../../../components/layout/sidebar/SidebarContext";
import { WelcomeBanner } from "./WelcomeBanner";
import { StatsGrid } from "./StatsGrid";
import { RecentlyPlayed } from "./RecentlyPlayed";
import { YourPlaylists } from "./YourPlaylists";
import { motion } from "framer-motion";

export function DashboardClient() {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-linear-to-br from-background via-background-secondary to-background-tertiary">
        <Sidebar activeTab="" setActiveTab={() => {}} user={user} onLogout={logout} mode="user" />

        <MainContent user={user} />
      </div>
    </SidebarProvider>
  );
}

function MainContent({ user }: { user: any }) {
  const { collapsed } = useSidebarState();

  return (
    <motion.main
      className={`overflow-auto min-h-screen transition-all duration-300 ${
        collapsed
          ? 'p-6 md:p-8 lg:p-10 xl:p-12' // More padding when collapsed
          : 'p-app-gutter md:p-app-gutter-md' // Normal padding when expanded
      }`}
      animate={{
        marginLeft: collapsed ? 64 : 288, // 16 * 4px = 64px, 72 * 4px = 288px
      }}
      transition={{
        duration: 0.3,
        ease: [0.4, 0.0, 0.2, 1],
        type: "tween"
      }}
    >
      <motion.div
        className={`app-container space-y-8 transition-all duration-300 ${
          collapsed
            ? 'max-w-none' // Full width when collapsed
            : 'max-w-7xl mx-auto' // Centered container when expanded
        }`}
        layout
      >
        <WelcomeBanner userName={user?.name || "Alex"} />
        <StatsGrid />
        <RecentlyPlayed collapsed={collapsed} />
        <YourPlaylists collapsed={collapsed} />
      </motion.div>
    </motion.main>
  );
}
