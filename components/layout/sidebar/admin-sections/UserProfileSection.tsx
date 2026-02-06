"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { getFullImageUrl } from "@/lib/utils/image-util";

interface UserProfileSectionProps {
  collapsed: boolean;
  user?: { name: string; profilePicture?: string; role?: string; username?: string; fullName?: string; email?: string };
  onLogout?: () => void;
}

export default function UserProfileSection({ collapsed, user, onLogout }: UserProfileSectionProps) {
  return (
    <div className="mt-auto flex justify-center">
      {collapsed ? (
        <div className="flex flex-col items-center gap-2">
          {user?.profilePicture && getFullImageUrl(user.profilePicture) ? (
            <img src={getFullImageUrl(user.profilePicture) || ""} alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground text-sm">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'AD'}
            </div>
          )}
          {onLogout && (
            <button onClick={onLogout} className="p-2 rounded-full hover:bg-accent transition-colors" title="Logout">
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center p-3 rounded-2xl border border-border bg-card/70 shadow-sm w-full max-w-xs relative">
          {user?.profilePicture && getFullImageUrl(user.profilePicture) ? (
            <img src={getFullImageUrl(user.profilePicture) || ""} alt="User Avatar" className="w-12 h-12 rounded-full object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-secondary-foreground text-lg">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'AD'}
            </div>
          )}
          <div className="flex-1 min-w-0 ml-3">
            <div className="font-bold text-foreground leading-tight truncate">{user?.username || 'Admin User'}</div>
            <div className="text-xs text-muted-foreground truncate">{user?.role || 'No role available'}</div>
          </div>
          {onLogout && (
            <button onClick={onLogout} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-accent transition-colors" title="Logout">
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}