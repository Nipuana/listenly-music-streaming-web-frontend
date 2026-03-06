"use client";

import React from "react";
import { useThemeToggle } from "@/hooks/use-theme-toggle";
import { useSidebarState } from "../../../Providers/Contexts/SidebarContext";
import { usePathname } from "next/navigation";
import { usePlayer } from "@/Providers/Contexts/player-context";
import { useIsMobile } from "@/hooks/use-mobile";

// Admin sections
import HeaderSection from "./admin-sections/HeaderSection";
import MainMenuSection from "./admin-sections/MainMenuSection";
import SystemSection from "./admin-sections/SystemSection";
import UserProfileSection from "./admin-sections/UserProfileSection";

// User sections
import UserHeaderSection from "./user-sections/UserHeaderSection";
import { MainNavSection } from "./user-sections/MainNavSection";
import { SettingsSection } from "./user-sections/SettingsSection";
import ProfileSection from "./user-sections/ProfileSection";
import { PlaylistsSection } from "./user-sections/PlaylistsSection";
// Artist sections
import ArtistHeaderSection from "./artist-sections/ArtistHeaderSection";
import { ArtistMainNavSection } from "./artist-sections/ArtistMainNavSection";
import ArtistSongsSection from "./artist-sections/ArtistSongsSection";

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  user?: any;
  onLogout?: () => void;
  onCreatePlaylist?: () => void;
  onCreateSong?: () => void;
  mode?: 'admin' | 'user' | 'artist' | 'auto';
}

export default function Sidebar({ activeTab = "", setActiveTab = () => {}, user, onLogout, onCreatePlaylist, onCreateSong, mode = 'auto' }: SidebarProps) {
  const { collapsed, setCollapsed, mobileSidebarOpen, isMounted } = useSidebarState();
  const { currentSong, isBarVisible } = usePlayer();
  const { toggleTheme, isDark, mounted } = useThemeToggle();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  // Prevent flash by not rendering until mounted
  if (!isMounted) {
    return (
      <div className={`fixed left-0 top-0 z-40 h-full bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl transition-all duration-300 w-16`} />
    );
  }

  // Determine sidebar mode
  const getSidebarMode = (): 'admin' | 'user' | 'artist' => {
    if (mode !== 'auto') return mode as 'admin' | 'user' | 'artist';

    // Check pathname first for immediate determination
    if (pathname?.startsWith('/admin')) return 'admin';
    if (pathname?.startsWith('/artist')) return 'artist';

    // Fallback to user role
    const userRole = user?.role?.toLowerCase();
    if (userRole === 'admin') return 'admin';
    if (userRole === 'artist') return 'artist';
    return 'user';
  };

  const sidebarMode = getSidebarMode();

  // Force sidebar to stay expanded in user mode
  const effectiveCollapsed = sidebarMode === 'user' || sidebarMode === 'artist' ? false : collapsed;
  
  // Override setCollapsed for user/artist mode to prevent collapsing
  const effectiveSetCollapsed = sidebarMode === 'user' || sidebarMode === 'artist' ? () => {} : setCollapsed;

  // Define sections for each role
  const roleSections: Record<string, {
    header: React.ReactElement;
    main: React.ReactElement;
    playlists?: React.ReactElement;
    system?: React.ReactElement;
    settings?: React.ReactElement;
    profile?: React.ReactElement;
  }> = {
    admin: {
      header: <HeaderSection collapsed={effectiveCollapsed} setCollapsed={effectiveSetCollapsed} />,
      main: <MainMenuSection activeTab={activeTab} setActiveTab={setActiveTab} collapsed={effectiveCollapsed} />,
      system: <SystemSection activeTab={activeTab} setActiveTab={setActiveTab} collapsed={effectiveCollapsed} toggleTheme={toggleTheme} isDark={isDark} mounted={mounted} />,
      profile: <UserProfileSection collapsed={effectiveCollapsed} user={user} onLogout={onLogout} />
    },
    user: {
      header: <UserHeaderSection collapsed={effectiveCollapsed} setCollapsed={effectiveSetCollapsed} allowCollapse={false} />,
      profile: <ProfileSection user={user} collapsed={effectiveCollapsed} />,
      main: <MainNavSection />,
      playlists: <PlaylistsSection onCreatePlaylist={onCreatePlaylist} />,
      settings: <SettingsSection onLogout={onLogout} />,
    }
    ,
    artist: {
      header: <ArtistHeaderSection collapsed={effectiveCollapsed} setCollapsed={effectiveSetCollapsed} allowCollapse={false} />,
      profile: <ProfileSection user={user} collapsed={effectiveCollapsed} />,
      main: <ArtistMainNavSection />,
      playlists: <ArtistSongsSection onCreateSong={onCreateSong} />,
      settings: <SettingsSection onLogout={onLogout} />
    }
    
  };

  const sections = roleSections[sidebarMode] || roleSections.user;

  const shouldPadForPlayer = sidebarMode === 'user' && Boolean(currentSong) && isBarVisible;

  return (
    <div className={`${isMobile ? 'fixed' : 'fixed'} left-0 top-0 z-40 ${isMobile ? (shouldPadForPlayer ? 'h-[calc(100vh-6rem)]' : 'h-screen') : 'h-full'} bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl transition-all duration-300 ease-in-out ${effectiveCollapsed && !isMobile ? 'w-16' : 'w-64'} ${isMobile && !mobileSidebarOpen ? '-translate-x-full' : ''}`}>
      <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ease-out`}>
        <div className="p-4">
          {/* Header Section */}
          {sections.header}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4">
          <div>
            {sections.main}
            {sections.playlists}
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="mt-auto p-4">
          <div>
            {sections.system}
            {sections.settings}
            {sections.profile}
          </div>
        </div>
      </div>

      {/* Subtle gradient overlay for aesthetics */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
    </div>
  );
}
