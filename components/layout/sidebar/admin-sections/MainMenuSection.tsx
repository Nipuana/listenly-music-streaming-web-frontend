"use client";

import React from "react";
import { LayoutDashboard, Users, Mic2, Music, DollarSign, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}

function SidebarItem({ icon, label, active, onClick, collapsed }: SidebarItemProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center ${collapsed ? 'justify-center' : 'gap-4'} px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
        active
          ? "text-primary-foreground"
          : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
      }`}
      title={label}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-primary rounded-2xl shadow-primary"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <span className={`${active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"} transition-colors relative z-10`}>
        {icon}
      </span>
      {!collapsed && (
        <>
          <span className="font-semibold text-sm whitespace-nowrap relative z-10">{label}</span>
          {active && (
            <motion.span 
              className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white] relative z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </>
      )}
    </motion.button>
  );
}

interface MainMenuSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
}

export default function MainMenuSection({ activeTab, setActiveTab, collapsed }: MainMenuSectionProps) {
  return (
    <nav className="space-y-1 flex-1">
      {!collapsed && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Main Menu</p>}
      <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} collapsed={collapsed} />
      <SidebarItem icon={<Users size={20} />} label="User Management" active={activeTab === "users"} onClick={() => setActiveTab("users")} collapsed={collapsed} />
      <SidebarItem icon={<Mic2 size={20} />} label="Artist Verification" active={activeTab === "artists"} onClick={() => setActiveTab("artists")} collapsed={collapsed} />
      <SidebarItem icon={<Music size={20} />} label="Content Library" active={activeTab === "content"} onClick={() => setActiveTab("content")} collapsed={collapsed} />
      <SidebarItem icon={<DollarSign size={20} />} label="Revenue & Plans" active={activeTab === "revenue"} onClick={() => setActiveTab("revenue")} collapsed={collapsed} />
      <SidebarItem icon={<MessageSquare size={20} />} label="Support & Feedback" active={activeTab === "feedback"} onClick={() => setActiveTab("feedback")} collapsed={collapsed} />
    </nav>
  );
}