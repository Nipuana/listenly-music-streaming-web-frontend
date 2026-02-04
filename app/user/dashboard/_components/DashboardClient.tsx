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
    <div className="flex flex-1 bg-linear-to-br from-background via-background-secondary to-background-tertiary">
      <UserSidebar />
      
      <main className="flex-1 p-app-gutter md:p-app-gutter-md overflow-auto">
        <div className="app-container space-y-8">
          <WelcomeBanner userName={user?.name || "Alex"} />
          <StatsGrid />
          <RecentlyPlayed />
          <YourPlaylists />
        </div>
      </main>
    </div>
  );
}
