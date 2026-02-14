"use client";

import React from "react";
import Link from "next/link";
import { getFullImageUrl } from "@/lib/utils/image-util";

interface ProfileSectionProps {
  user?: { name: string; profilePicture?: string; role?: string; username?: string; fullName?: string; email?: string };
  collapsed: boolean;
}

export default function ProfileSection({ user, collapsed }: ProfileSectionProps) {
  if (collapsed) {
    return (
      <div className="flex justify-center mb-4">
        <Link href="/user/profile" className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-accent transition-colors">
          {user?.profilePicture && getFullImageUrl(user.profilePicture) ? (
            <img src={getFullImageUrl(user.profilePicture) || ""} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'U'}
            </div>
          )}
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <Link
        href="/user/profile"
        className="flex items-center p-3 rounded-2xl border border-border bg-card/70 shadow-sm hover:bg-accent transition-colors w-full max-w-xs"
      >
        {user?.profilePicture && getFullImageUrl(user.profilePicture) ? (
          <img src={getFullImageUrl(user.profilePicture) || ""} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground text-sm">
            {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : 'U'}
          </div>
        )}
        <div className="flex-1 min-w-0 ml-3">
          <div className="font-bold text-foreground leading-tight truncate">
            {user?.username || user?.name || 'User'}
          </div>
          <div className="text-xs text-muted-foreground truncate">
            View Profile
          </div>
        </div>
      </Link>
    </div>
  );
}