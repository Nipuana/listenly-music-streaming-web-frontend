"use client"
import { Music, BarChart2, Heart, TrendingUp, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "../context/auth-context";

const playlists = [
  { name: "Chill Vibes" },
  { name: "Workout Mix" },
  { name: "Study Sessions" },
];

export default function DashboardPage() {
  const { user,logout }=useAuth();
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-background">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/dashboard">
                      <BarChart2 className="w-5 h-5" /> Dashboard
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <BarChart2 className="w-5 h-5" /> Library
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Heart className="w-5 h-5" /> Liked Songs
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <TrendingUp className="w-5 h-5" /> Trending
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>My Playlists</SidebarGroupLabel>
              <SidebarMenu>
                {playlists.map((playlist) => (
                  <SidebarMenuItem key={playlist.name}>
                    <SidebarMenuButton asChild>
                      <a href="#">
                        <Music className="w-4 h-4" /> {playlist.name}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <Settings className="w-5 h-5" /> Feedback
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#">
                      <LogOut className="w-5 h-5" /> Logout
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-2xl text-muted-foreground">Welcome to your Dashboard!</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
