"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSidebarState } from "@/Providers/Contexts/SidebarContext";
import Sidebar from "./sidebar";
import { LogoutConfirmDialog } from "@/components/ui/logout-confirm-dialog";

interface SidebarLayoutProps {
  children: React.ReactNode;
  mode?: "admin" | "user" | "auto";
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

export function SidebarLayout({ 
  children, 
  mode = "auto", 
  className = "",
  activeTab,
  setActiveTab,
  user,
  onLogout
}: SidebarLayoutProps) {
  const { collapsed } = useSidebarState();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    if (onLogout) {
      await onLogout();
    }
    setShowLogoutConfirm(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex flex-1">
        <Sidebar 
          mode={mode} 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          onLogout={handleLogoutClick}
        />
        <motion.main
          className={`flex-1 p-6 transition-all duration-300 ${mode === "user" ? "pb-28" : ""} ${className}`}
          variants={contentVariants}
          initial="expanded"
          animate={collapsed ? "collapsed" : "expanded"}
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
    </div>
  );
}