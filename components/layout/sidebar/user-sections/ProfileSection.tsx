"use client";

import React from "react";
import Link from "next/link";
import { UserAvatar } from "@/components/ui/user-avatar";


interface ProfileSectionProps {
  user?: { name: string; profilePicture?: string; role?: string; username?: string; fullName?: string; email?: string };
  collapsed: boolean;
}

export default function ProfileSection({ user, collapsed }: ProfileSectionProps) {
  const displayName = user?.username || user?.name || user?.fullName || user?.email || "User";
  const profilePicture = (user as any)?.profilePicture || (user as any)?.profilePicUrl || (user as any)?.avatar || null;

  const isArtist = (user as any)?.role === "artist";
  const profileHref = isArtist ? "/artist/profile" : "/user/profile";

  

  if (collapsed) {
    return (
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center gap-2 p-2 rounded-xl">
          <UserAvatar
            name={displayName}
            profilePicture={profilePicture}
            size="default"
            fallbackClassName="bg-primary text-primary-foreground font-bold"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="mb-4">
        <div className="flex items-center p-3 rounded-2xl border border-border bg-card/70 shadow-sm transition-colors w-full max-w-xs">
          <div className="p-0">
            <UserAvatar
              name={displayName}
              profilePicture={profilePicture}
              size="lg"
              fallbackClassName="bg-primary text-primary-foreground font-bold"
            />
          </div>
          <Link
            href={profileHref}
            className="flex-1 min-w-0 ml-3"
          >
            <div className="font-bold text-foreground leading-tight truncate">{displayName}</div>
            <div className="text-xs text-muted-foreground truncate">View Profile</div>
          </Link>
        </div>
        
      </div>
    </div>
  );
}