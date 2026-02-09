"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { SidebarProvider, useSidebarState } from "@/Providers/Contexts/SidebarContext";
import Sidebar from "@/components/layout/sidebar/sidebar";
import UserManagementSection from "../_components/user_management/UserManagementSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Mic2, DollarSign, Search, Bell, TrendingUp, Play } from "lucide-react";
import { LogoutConfirmDialog } from "@/components/ui/logout-confirm-dialog";


export default function AdminDashboardScreen() {
  return (
    <SidebarProvider>
      <InnerDashboard />
    </SidebarProvider>
  );
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
        <MainContent activeTab={activeTab} />
      </div>
    </div>
  );
}

function MainContent({ activeTab }: { activeTab: string }) {
  return (
    <main className="min-h-screen p-6 md:p-8 lg:p-10 xl:p-12">
      <div className="max-w-7xl mx-20 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-1">
            {activeTab === 'overview' && 'System Overview'}
            {activeTab === 'users' && 'User Management'}
            {activeTab === 'artists' && 'Artist Verification'}
            {activeTab === 'content' && 'Content Moderation'}
            {activeTab === 'revenue' && 'Revenue Analytics'}
            {activeTab === 'feedback' && 'Customer Support'}
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
            {/* Example stats cards */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard title="Total Revenue" value="$128,430" trend="+14.2%" trendUp={true} icon={<DollarSign className="text-primary-foreground" />} color="bg-primary" />
              <StatsCard title="Active Users" value="42,560" trend="+8.1%" trendUp={true} icon={<Users className="text-primary-foreground" />} color="bg-secondary" />
              <StatsCard title="Total Streams" value="1.2M" trend="+24.5%" trendUp={true} icon={<Play className="text-primary-foreground" />} color="bg-accent" />
              <StatsCard title="New Artists" value="124" trend="-2.4%" trendUp={false} icon={<Mic2 className="text-primary-foreground" />} color="bg-muted" />
            </div>
            {/* Add more dashboard content as needed */}
          </div>
        )}
        {activeTab === 'users' && <UserManagementSection />}
        {activeTab === 'artists' && (
          <div className="text-center py-12">
            <Mic2 className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Artist Verification section coming soon...</p>
          </div>
        )}
        {activeTab === 'content' && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Content Library section coming soon...</p>
          </div>
        )}
        {activeTab === 'revenue' && (
          <div className="text-center py-12">
            <DollarSign className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Revenue & Plans section coming soon...</p>
          </div>
        )}
        {activeTab === 'feedback' && (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Support & Feedback section coming soon...</p>
          </div>
        )}
        {activeTab === 'theme' && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Theme customization coming soon...</p>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">Security Logs section coming soon...</p>
          </div>
        )}
      </div>
      {/* Add more tab screens here, e.g. Artists, etc. */}
    </div>
    </main>
  );
}


function StatsCard({ title, value, trend, trendUp, icon, color }: {
  title: string,
  value: string,
  trend: string,
  trendUp: boolean,
  icon: React.ReactNode,
  color: string
}) {
  return (
    <Card className="border-border/50 shadow-sm bg-card/80 backdrop-blur-md hover:shadow-primary hover:-translate-y-1 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-primary`}>
            {icon}
          </div>
          <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${
            trendUp ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
          }`}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
            {trend}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">{title}</p>
          <h3 className="text-3xl font-black text-foreground">{value}</h3>
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <Progress value={trendUp ? 75 : 35} className={`h-1.5 ${trendUp ? 'bg-success/20' : 'bg-destructive/20'}`} />
        </div>
      </CardContent>
    </Card>
  );
}
