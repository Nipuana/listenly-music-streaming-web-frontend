"use client";

import React, { useMemo, useState } from "react";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { SidebarProvider, useSidebarState } from "@/Providers/Contexts/SidebarContext";
import Sidebar from "@/components/layout/sidebar/sidebar";
import UserManagementSection from "../_components/user_management/UserManagementSection";
import ArtistVerificationSection from "../_components/artist_management/ArtistVerificationSection";
import SecurityLogsSection from "../_components/security/SecurityLogsSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Mic2, Search, Bell, Play, Clock } from "lucide-react";
import { LogoutConfirmDialog } from "@/components/ui/logout-confirm-dialog";
import { useAllUserRoleCounts } from "@/hooks/user-hooks/use-all-user-role-counts";
import { useAdminStreamingTotals } from "@/hooks/stats-hooks/use-admin-streaming-totals";
import { useAdminOverallStats } from "@/hooks/stats-hooks/use-admin-overall-stats";


export default function AdminDashboardScreen() {
  return (
    <SidebarProvider>
      <InnerDashboard />
    </SidebarProvider>
  );
}

function StatsSubtitle({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-muted-foreground">{children}</span>;
}

function InnerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout, user: authUser } = useAuth();
  const { collapsed } = useSidebarState();

  async function handleLogout() {
    setShowLogoutConfirm(true);
  }

  async function confirmLogout() {
    await logout();
    setShowLogoutConfirm(false);
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background-secondary to-background-tertiary">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={authUser} onLogout={handleLogout} mode="admin" />

      <div style={{ marginLeft: collapsed ? '64px' : '256px' }} className="transition-all duration-300 ease-in-out">
        <LogoutConfirmDialog
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={confirmLogout}
        />
        <MainContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

function MainContent({ activeTab, setActiveTab }: { activeTab: string, setActiveTab?: (t: string) => void }) {
  const { counts, loading: countsLoading } = useAllUserRoleCounts();
  const { totals: clientTotals, loading: clientTotalsLoading } = useAdminStreamingTotals();
  const { totals: adminTotals, loading: adminTotalsLoading, refetch: refetchAdminTotals } = useAdminOverallStats();

  const totals = (adminTotals && (adminTotals.totalStreams || adminTotals.totalStreamingHours || adminTotals.songCount)) ? adminTotals : clientTotals;

  const overviewLoading = countsLoading || adminTotalsLoading || clientTotalsLoading;

  const analytics = useMemo(() => {
    const safe = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : (typeof v === 'string' ? Number(v) || 0 : 0));

    const totalAccounts = safe(counts.total);
    const artistsCount = safe(counts.artists);
    const regularUsersCount = safe(counts.regularUsers);

    const totalStreams = safe(totals.totalStreams);
    const totalListenTimeSeconds = safe(totals.totalListenTimeSeconds);
    const songCount = safe(totals.songCount);

    const artistsShare = totalAccounts > 0 ? (artistsCount / totalAccounts) * 100 : 0;

    const streamsPerSong = songCount > 0 ? totalStreams / songCount : 0;
    const minutesPerStream = totalStreams > 0 ? (totalListenTimeSeconds / totalStreams) / 60 : 0;
    const streamsPerUser = regularUsersCount > 0 ? totalStreams / regularUsersCount : 0;
    const streamsPerArtist = artistsCount > 0 ? totalStreams / artistsCount : 0;

    return {
      artistsShare,
      streamsPerSong,
      minutesPerStream,
      streamsPerUser,
      streamsPerArtist,
    };
  }, [counts, totals]);

  function formatCompactNumber(value: number) {
    return Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }

  function formatNumber(value: number) {
    return Intl.NumberFormat("en-US").format(Math.round(value));
  }

  function formatFixed(value: number, digits = 1) {
    if (!Number.isFinite(value)) return "0";
    return Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);
  }

  return (
    <main className="min-h-screen p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">
            {activeTab === 'overview' && 'System Overview'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'artists' && 'Artist Verification'}
            {activeTab === 'theme' && 'Theme Settings'}
            {activeTab === 'theme' && 'Theme Settings'}
            {activeTab === 'security' && 'Security Audit'}
          </h2>
          <p className="text-muted-foreground text-sm">Welcome back, here's what's happening with Listenly today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl border-border bg-card/80 hover:bg-card relative p-2.5">
            <Bell size={18} className="text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card"></span>
          </Button>
        </div>
      </header>
      {/* Render tab content here, e.g. Overview, Users, etc. */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Overview stats */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Users"
                value={overviewLoading ? "..." : formatNumber(counts.regularUsers)}
                icon={<Users className="text-primary-foreground" />}
                color="bg-secondary"
              />
              <StatsCard
                title="Total Artists"
                value={overviewLoading ? "..." : formatNumber(counts.artists)}
                icon={<Mic2 className="text-primary-foreground" />}
                color="bg-secondary"
              />
              <StatsCard
                title="Total Streams"
                value={overviewLoading ? "..." : formatCompactNumber(totals.totalStreams)}
                icon={<Play className="text-foreground" />}
                color="bg-accent"
              />
              <StatsCard
                title="Streaming Hours"
                value={overviewLoading ? "..." : formatCompactNumber(totals.totalStreamingHours)}
                subtitle={overviewLoading ? "..." : <StatsSubtitle>{`${formatFixed(analytics.minutesPerStream, 1)} min/stream`}</StatsSubtitle>}
                action={(
                  <Button variant="ghost" size="sm" onClick={() => refetchAdminTotals && refetchAdminTotals()} className="ml-2">
                    Refresh
                  </Button>
                )}
                icon={<Clock className="text-foreground" />}
                color="bg-primary/50"
              />
            </div>

            {/* Admin controls: big buttons linking to admin sections */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Card onClick={() => setActiveTab && setActiveTab('users')} className="cursor-pointer hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shadow-primary">
                        <Users className="text-primary-foreground" />
                      </div>
                    <div>
                      <p className="text-xs text-muted-foreground">User Management</p>
                      <p className="text-lg font-bold">Manage users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card onClick={() => setActiveTab && setActiveTab('artists')} className="cursor-pointer hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shadow-primary">
                        <Mic2 className="text-primary-foreground" />
                      </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Artist Verification</p>
                      <p className="text-lg font-bold">Review artist requests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card onClick={() => setActiveTab && setActiveTab('content')} className="cursor-pointer hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-primary">
                        <Search className="text-primary-foreground" />
                      </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Content Library</p>
                      <p className="text-lg font-bold">Manage songs & playlists</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card onClick={() => setActiveTab && setActiveTab('security')} className="cursor-pointer hover:shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-primary/50 flex items-center justify-center shadow-primary">
                        <Bell className="text-primary-foreground" />
                      </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Security</p>
                      <p className="text-lg font-bold">Audit logs & alerts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Descriptions to fill the page */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 mt-6">
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold">User Management</h4>
                  <p className="text-sm text-muted-foreground mt-2">View and manage all user accounts, adjust roles and permissions, deactivate or restore accounts, and monitor user activity to keep the platform safe and organized.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold">Artist Verification</h4>
                  <p className="text-sm text-muted-foreground mt-2">Review and process artist verification requests, check submitted documents, approve or decline applicants, and communicate verification status to creators.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold">Content Library</h4>
                  <p className="text-sm text-muted-foreground mt-2">Manage songs and playlists across the catalog: edit metadata, remove or restore tracks, and curate featured content to ensure high-quality listening experiences.</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold">Security & Audit</h4>
                  <p className="text-sm text-muted-foreground mt-2">Access audit logs and security alerts, investigate suspicious activity, and export logs for compliance and incident response workflows.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        {activeTab === 'users' && <UserManagementSection />}
        {activeTab === 'artists' && (
          <div className="py-2">
            <ArtistVerificationSection />
          </div>
        )}
        {activeTab === 'content' && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Content Library section coming soon...</p>
          </div>
        )}
        {/* Removed Content, Revenue, and Support/Feedback sections per request */}
        {activeTab === 'security' && <SecurityLogsSection />}
      </div>
      {/* Add more tab screens here, e.g. Artists, etc. */}
    </div>
    </main>
  );
}


function StatsCard({ title, value, icon, color, subtitle, action }: {
  title: string,
  value: string,
  icon: React.ReactNode,
  color: string,
  subtitle?: React.ReactNode,
  action?: React.ReactNode,
}) {
  return (
    <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-md hover:shadow-primary hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-primary`}>
            {icon}
          </div>
          <div>
            {action}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-black text-foreground">{value}</h3>
          {/* optional subtitle */}
          {subtitle ? <div>{subtitle}</div> : null}
        </div>
      </CardContent>
    </Card>
  );
}
