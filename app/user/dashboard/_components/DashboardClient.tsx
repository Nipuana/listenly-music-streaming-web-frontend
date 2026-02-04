"use client";
import { useAuth } from "../../../(auth)/context/auth-context";
import { UserSidebar } from "../../_components/UserSidebar";
import { WelcomeBanner } from "./WelcomeBanner";
import { StatsGrid } from "./StatsGrid";
import { RecentlyPlayed } from "./RecentlyPlayed";
import { YourPlaylists } from "./YourPlaylists";

export function DashboardClient() {
  const { user } = useAuth();

  return (
    <div className="flex flex-1 bg-linear-to-br from-background via-background to-accent/20">
      <UserSidebar />
      
      <main className="flex-1 p-4 md:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <WelcomeBanner userName={user?.name || "Alex"} />
          <StatsGrid />
          <RecentlyPlayed />
          <YourPlaylists />
        </div>
      </main>
    </div>
  );
}
