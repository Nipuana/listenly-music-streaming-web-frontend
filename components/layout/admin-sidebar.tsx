"use client";

import React, { useState } from "react";
import { LayoutDashboard, Users, Mic2, Music, DollarSign, MessageSquare, Sun, Moon, LogOut, Music2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useThemeToggle } from "@/hooks/use-theme-toggle";

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
          ? "text-white"
          : "text-slate-500 hover:bg-blue-50 hover:text-[#476FE9]"
      }`}
      title={label}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-linear-to-r from-[#283F83] to-[#476FE9] rounded-2xl shadow-lg shadow-blue-200"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
      <span className={`${active ? "text-white" : "text-slate-400 group-hover:text-[#476FE9]"} transition-colors relative z-10`}>
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

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: { name: string; avatarUrl?: string; role?: string; username?: string; fullName?: string; email?: string };
  onLogout?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { toggleTheme, isDark, mounted } = useThemeToggle();

  const handleThemeClick = () => {
    toggleTheme();
  };

  return (
    <aside className={`bg-white/80 backdrop-blur-xl border-r border-blue-100 h-screen sticky top-0 hidden lg:flex flex-col transition-all duration-300 ${collapsed ? 'w-24 p-4' : 'w-72 p-6'}`}>
      <div className="flex items-center justify-center mb-10">
        {collapsed ? (
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 focus:outline-none hover:bg-blue-50 rounded-xl transition-all" title="Expand sidebar">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#283F83] to-[#476FE9] flex items-center justify-center shadow-lg shadow-blue-200">
              <Music2 className="w-6 h-6 text-white" />
            </div>
          </button>
        ) : (
          <div className="flex items-center justify-between w-full px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#283F83] to-[#476FE9] flex items-center justify-center shadow-lg shadow-blue-200">
                <Music2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-linear-to-r from-[#283F83] to-[#476FE9] bg-clip-text text-transparent">Listenly</h1>
                <p className="text-[10px] uppercase tracking-widest text-[#476FE9] font-semibold">Admin Panel</p>
              </div>
            </div>
            <button onClick={() => setCollapsed(!collapsed)} className="ml-auto p-2 focus:outline-none hover:bg-blue-50 rounded-lg transition-all" title="Collapse sidebar">
              <span className="text-lg">←</span>
            </button>
          </div>
        )}
      </div>
      <nav className="space-y-1 flex-1">
        {!collapsed && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Main Menu</p>}
        <SidebarItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === "overview"} onClick={() => setActiveTab("overview")} collapsed={collapsed} />
        <SidebarItem icon={<Users size={20} />} label="User Management" active={activeTab === "users"} onClick={() => setActiveTab("users")} collapsed={collapsed} />
        <SidebarItem icon={<Mic2 size={20} />} label="Artist Verification" active={activeTab === "artists"} onClick={() => setActiveTab("artists")} collapsed={collapsed} />
        <SidebarItem icon={<Music size={20} />} label="Content Library" active={activeTab === "content"} onClick={() => setActiveTab("content")} collapsed={collapsed} />
        <SidebarItem icon={<DollarSign size={20} />} label="Revenue & Plans" active={activeTab === "revenue"} onClick={() => setActiveTab("revenue")} collapsed={collapsed} />
        <SidebarItem icon={<MessageSquare size={20} />} label="Support & Feedback" active={activeTab === "feedback"} onClick={() => setActiveTab("feedback")} collapsed={collapsed} />
        <div className="pt-8">
          {!collapsed && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">System</p>}
          <SidebarItem 
            icon={mounted ? (isDark ? <Moon size={20} /> : <Sun size={20} />) : <Sun size={20} />} 
            label={mounted ? (isDark ? "Dark Mode" : "Light Mode") : "Theme Toggle"} 
            active={false} 
            onClick={handleThemeClick} 
            collapsed={collapsed} 
          />
          <SidebarItem icon={<Shield size={20} />} label="Security Logs" active={activeTab === "security"} onClick={() => setActiveTab("security")} collapsed={collapsed} />
        </div>
      </nav>
      <div className="mt-auto flex justify-center">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-sm">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'AD'}
              </div>
            )}
            {onLogout && (
              <button onClick={onLogout} className="p-2 rounded-full hover:bg-blue-50 transition-colors" title="Logout">
                <LogOut className="w-5 h-5 text-blue-500" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center p-3 rounded-2xl border border-blue-100 bg-white/70 shadow-sm w-full max-w-xs relative">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-lg">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'AD'}
              </div>
            )}
            <div className="flex-1 min-w-0 ml-3">
              <div className="font-bold text-[#283F83] leading-tight truncate">{user?.username || 'Admin User'}</div>
              <div className="text-xs text-blue-500 truncate">{user?.role || 'No role available'}</div>
            </div>
            {onLogout && (
              <button onClick={onLogout} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-blue-50 transition-colors" title="Logout">
                <LogOut className="w-5 h-5 text-blue-500" />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
