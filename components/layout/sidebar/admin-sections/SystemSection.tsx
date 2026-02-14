"use client";

import React from "react";
import { Sun, Moon, Shield } from "lucide-react";
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

interface SystemSectionProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  toggleTheme: () => void;
  isDark: boolean;
  mounted: boolean;
}

export default function SystemSection({ activeTab, setActiveTab, collapsed, toggleTheme, isDark, mounted }: SystemSectionProps) {
  const handleThemeClick = () => {
    toggleTheme();
  };

  return (
    <div className="pt-8">
      {!collapsed && <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">System</p>}
      <SidebarItem 
        icon={mounted ? (isDark ? <Moon size={20} /> : <Sun size={20} />) : <Sun size={20} />} 
        label={mounted ? (isDark ? "Dark Mode" : "Light Mode") : "Theme Toggle"} 
        active={false} 
        onClick={handleThemeClick} 
        collapsed={collapsed} 
      />
      <SidebarItem icon={<Shield size={20} />} label="Security Logs" active={activeTab === "security"} onClick={() => setActiveTab("security")} collapsed={collapsed} />
    </div>
  );
}