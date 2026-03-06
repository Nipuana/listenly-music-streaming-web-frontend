"use client";

import { useAuth } from "@/Providers/Contexts/auth-context";
import { SidebarLayout } from "@/components/layout/sidebar/SidebarLayout";
import { ArtistProfileHeader } from "./ArtistProfileHeader";
import { ArtistProfileStats } from "./ArtistProfileStats";
import { ArtistRecentUploads } from "./ArtistRecentUploads";
import { Separator } from "@/components/ui/separator";
import { AccountDetails } from "@/app/user/profile/_components/AccountDetails";

export function ArtistProfileDashboard() {
  const { user, logout } = useAuth();

  return (
    <SidebarLayout mode="artist" onLogout={logout} user={user}>
      <main className="overflow-auto min-h-screen p-6 md:p-8 lg:p-10 xl:p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <ArtistProfileHeader user={user} />
          <Separator className="my-8" />
          <ArtistProfileStats />
          <Separator className="my-8" />
          <AccountDetails user={user} />
          <Separator className="my-8" />
          <ArtistRecentUploads />
        </div>
      </main>
    </SidebarLayout>
  );
}
