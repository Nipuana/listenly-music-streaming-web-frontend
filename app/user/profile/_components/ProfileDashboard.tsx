"use client";
import { useAuth } from "../../../../Providers/Contexts/auth-context";
import Sidebar from "../../../../components/layout/sidebar/sidebar";
import { SidebarProvider, useSidebarState } from "../../../../Providers/Contexts/SidebarContext";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";
import { QuickActions } from "./QuickActions";
import { AccountDetails } from "./AccountDetails";
import { RecentActivity } from "./RecentActivity";

export function ProfileDashboard() {
  const { user, logout } = useAuth();
  const { collapsed } = useSidebarState();

  return (
    <SidebarProvider user={user}>
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
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Profile Header Section */}
        <ProfileHeader user={user} />

        <Separator className="my-8" />

        {/* Profile Stats Section */}
        <ProfileStats />

        <Separator className="my-8" />

        {/* Quick Actions Section */}
        <QuickActions />

        <Separator className="my-8" />

        {/* Account Information Section */}
        <AccountDetails user={user} />

        <Separator className="my-8" />

        {/* Recent Activity Section */}
        <RecentActivity />

      </div>
    </main>
  );
}