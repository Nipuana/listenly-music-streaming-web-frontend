"use client";

import React from "react";
import { LogOut } from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";

interface UserProfileSectionProps {
  collapsed: boolean;
  user?: { name: string; profilePicture?: string; role?: string; username?: string; fullName?: string; email?: string };
  onLogout?: () => void;
}

export default function UserProfileSection({ collapsed, user, onLogout }: UserProfileSectionProps) {
  const displayName = user?.username || user?.name || user?.fullName || user?.email || "Admin User";
  const profilePicture = (user as any)?.profilePicture || (user as any)?.profilePicUrl || (user as any)?.avatar || null;

  return (
    <div className="mt-auto flex justify-center">
      {collapsed ? (
        <div className="flex flex-col items-center gap-2">
          <UserAvatar
            name={displayName}
            profilePicture={profilePicture}
            size="lg"
            fallbackClassName="bg-secondary text-secondary-foreground font-bold"
          />
          {onLogout && (
            <button onClick={onLogout} className="p-2 rounded-full hover:bg-accent transition-colors" title="Logout">
              <LogOut className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center p-3 rounded-2xl border border-border bg-card/70 shadow-sm w-full max-w-xs relative">
          <UserAvatar
            name={displayName}
            profilePicture={profilePicture}
            size="lg"
            className="size-12"
            fallbackClassName="bg-secondary text-secondary-foreground font-bold"
          />
          <div className="flex-1 min-w-0 ml-3">
            <div className="font-bold text-foreground leading-tight truncate">{displayName}</div>
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