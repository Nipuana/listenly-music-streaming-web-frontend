"use client";
import { useAuth } from "../../../../Providers/Contexts/auth-context";
import { SidebarLayout } from "../../../../components/layout/sidebar/SidebarLayout";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileStats } from "./ProfileStats";
import { QuickActions } from "./QuickActions";
import { AccountDetails } from "./AccountDetails";
import { RecentActivity } from "./RecentActivity";

export function ProfileDashboard() {
  const { user, logout } = useAuth();

  return (
    <SidebarLayout mode="user" onLogout={logout} user={user}>
      <MainContent user={user} />
    </SidebarLayout>
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

        <Separator className="my-8" />

        {/* Artist Verification Section */}
        <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle>Register as an Artist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Want to upload and manage your tracks officially? Start the artist verification process.
            </p>
            <Button asChild>
              <Link href="/user/verification-request">Start verification</Link>
            </Button>
          </CardContent>
        </Card>

      </div>
    </main>
  );
}