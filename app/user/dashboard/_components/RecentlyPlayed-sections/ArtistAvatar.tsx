"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useArtistProfile } from "@/hooks/artist-hooks/use-artist-profile";

interface ArtistAvatarProps {
  userId: string;
  size?: number;
  showTooltip?: boolean;
  onClick?: () => void;
}

export function ArtistAvatar({ userId, size = 24, showTooltip = true, onClick }: ArtistAvatarProps) {
  const { name: artistName, profilePicSrc, profilePicFallback, loading: artistLoading } = useArtistProfile(userId || undefined);

  const avatar = (
    <div
      className={`rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold overflow-hidden shrink-0 ${
        onClick ? 'cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all' : ''
      }`}
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {profilePicSrc ? (
        <img
          src={profilePicSrc}
          alt={artistName || 'Artist'}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = profilePicFallback;
            }
          }}
        />
      ) : (
        profilePicFallback
      )}
    </div>
  );

  if (!showTooltip) {
    return avatar;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {avatar}
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>View artist profile</p>
      </TooltipContent>
    </Tooltip>
  );
}