"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSidebarState } from "@/Providers/Contexts/SidebarContext";
import { useAuth } from "@/Providers/Contexts/auth-context";
import Sidebar from "./sidebar";
import { LogoutConfirmDialog } from "@/components/ui/logout-confirm-dialog";
import { CreatePlaylistPopup } from "@/app/user/_components/popups/CreatePlaylistPopup";
import { CreateSongPopup } from "@/app/artist/_components/popups/CreateSongPopup";
import { refetchMyPlaylists } from "@/hooks/cashing-hooks/use-my-playlists";
import { refetchMySongs } from "@/hooks/cashing-hooks/use-my-songs";
import { refetchAllPlaylists } from "@/hooks/cashing-hooks/use-all-playlists";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarLayoutProps {
  children: React.ReactNode;
  mode?: "admin" | "user" | "artist" | "auto";
  className?: string;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  user?: any;
  onLogout?: () => void;
}

const contentVariants = {
  expanded: { marginLeft: 256 },
  collapsed: { marginLeft: 64 }
};

const mobileContentVariants = {
  open: { marginLeft: 0 },
  closed: { marginLeft: 0 }
};

export function SidebarLayout({ 
  children, 
  mode = "auto", 
  className = "",
  activeTab,
  setActiveTab,
  user,
  onLogout
}: SidebarLayoutProps) {
  // access auth context for fallback values
  const { logout: contextLogout, user: contextUser } = useAuth();

  // if no user prop provided, use context user (reduces duplication in pages)
  const effectiveUser = user || contextUser;

  const { collapsed, mobileSidebarOpen, setMobileSidebarOpen } = useSidebarState();
  const isMobile = useIsMobile();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [showCreateSong, setShowCreateSong] = useState(false);

  // Force expanded behavior for user and artist modes
  const effectiveCollapsed = (mode === "user" || mode === "artist" || effectiveUser?.role === 'artist') ? false : collapsed;

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    // call provided handler or fallback to context logout
    if (onLogout) {
      await onLogout();
    } else if (contextLogout) {
      await contextLogout();
    }
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex flex-1 relative">
        {/* Mobile Backdrop */}
        {isMobile && mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`${isMobile ? 'absolute' : 'relative'} z-40`}>
          <Sidebar 
            mode={mode} 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={effectiveUser}
            onLogout={handleLogoutClick}
            onCreatePlaylist={() => setShowCreatePlaylist(true)}
            onCreateSong={() => setShowCreateSong(true)}
          />
        </div>
        
        <motion.main
          className={`flex-1 p-6 transition-all duration-300 ${mode === "user" || mode === "artist" ? "pb-28" : ""} ${className} ${isMobile ? 'relative z-20' : 'px-6 pb-6'}`}
          variants={isMobile ? mobileContentVariants : contentVariants}
          initial={isMobile ? "closed" : "expanded"}
          animate={
            isMobile 
              ? (mobileSidebarOpen ? "open" : "closed") 
              : (effectiveCollapsed ? "collapsed" : "expanded")
          }
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {children}
        </motion.main>
      </div>
      <LogoutConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
      {mode === "user" && (
        <CreatePlaylistPopup
          isOpen={showCreatePlaylist}
          onClose={() => setShowCreatePlaylist(false)}
          onSuccess={() => {
            setShowCreatePlaylist(false);
            refetchMyPlaylists();
            refetchAllPlaylists();
          }}
        />
      )}
      {(mode === "artist" || effectiveUser?.role === 'artist') && (
        <CreateSongPopup
          isOpen={showCreateSong}
          onClose={() => setShowCreateSong(false)}
          onSuccess={() => {
            setShowCreateSong(false);
            // Refresh cached my-songs so lists update immediately
            refetchMySongs();
          }}
        />
      )}
    </div>
  );
}