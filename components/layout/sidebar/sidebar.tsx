"use client";

import React from "react";
import { motion } from "framer-motion";
import { useThemeToggle } from "@/hooks/use-theme-toggle";
import { useSidebarState } from "./SidebarContext";
import { usePathname } from "next/navigation";

// Admin sections
import HeaderSection from "./admin-sections/HeaderSection";
import MainMenuSection from "./admin-sections/MainMenuSection";
import SystemSection from "./admin-sections/SystemSection";
import UserProfileSection from "./admin-sections/UserProfileSection";

// User sections
import UserHeaderSection from "./user-sections/UserHeaderSection";
import { MainNavSection } from "./user-sections/MainNavSection";
import { PlaylistsSection } from "./user-sections/PlaylistsSection";
import { SettingsSection } from "./user-sections/SettingsSection";

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  user?: any;
  onLogout?: () => void;
  mode?: 'admin' | 'user' | 'auto';
}

export default function Sidebar({ activeTab = "", setActiveTab = () => {}, user, onLogout, mode = 'auto' }: SidebarProps) {
  const { collapsed, setCollapsed, isMounted } = useSidebarState();
  const { toggleTheme, isDark, mounted } = useThemeToggle();
  const pathname = usePathname();

  // Prevent flash by not rendering until mounted
  if (!isMounted) {
    return (
      <div className={`fixed left-0 top-0 z-40 h-full bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl transition-all duration-300 w-16`} />
    );
  }

  // Determine sidebar mode
  const getSidebarMode = (): 'admin' | 'user' => {
    if (mode !== 'auto') return mode;

    // Check pathname first for immediate determination
    if (pathname?.startsWith('/admin')) return 'admin';

    // Fallback to user role
    const userRole = user?.role?.toLowerCase();
    return userRole === 'admin' ? 'admin' : 'user';
  };

  const sidebarMode = getSidebarMode();

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
      header: <HeaderSection collapsed={collapsed} setCollapsed={setCollapsed} />,
      main: <MainMenuSection activeTab={activeTab} setActiveTab={setActiveTab} collapsed={collapsed} />,
      system: <SystemSection activeTab={activeTab} setActiveTab={setActiveTab} collapsed={collapsed} toggleTheme={toggleTheme} isDark={isDark} mounted={mounted} />,
      profile: <UserProfileSection collapsed={collapsed} user={user} onLogout={onLogout} />
    },
    user: {
      header: <UserHeaderSection collapsed={collapsed} setCollapsed={setCollapsed} />,
      main: <MainNavSection />,
      playlists: <PlaylistsSection />,
      settings: <SettingsSection />
    }
  };

  const sections = roleSections[sidebarMode] || roleSections.user;

  return (
    <motion.div
      initial={{ width: collapsed ? 64 : 256 }}
      animate={{
        width: collapsed ? 64 : 256,
        transition: {
          duration: 0.3,
          ease: [0.4, 0.0, 0.2, 1], // Material Design easing
          type: "tween"
        }
      }}
      className="fixed left-0 top-0 z-40 h-full bg-card/95 backdrop-blur-xl border-r border-border shadow-2xl"
    >
      <motion.div
        className="flex flex-col h-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <div className="p-4">
          {/* Header Section */}
          {sections.header}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {sections.main}
            {sections.playlists}
          </motion.div>
        </div>

        {/* Bottom Sections */}
        <div className="mt-auto p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {sections.system}
            {sections.settings}
            {sections.profile}
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle gradient overlay for aesthetics */}
      <div className="absolute inset-0 bg-linear-to-b from-primary/5 via-transparent to-primary/5 pointer-events-none" />
    </motion.div>
  );
}
