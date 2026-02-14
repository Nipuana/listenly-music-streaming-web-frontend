"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getFullImageUrl } from "@/lib/utils/image-util"

interface UserAvatarProps {
  name: string
  profilePicUrl?: string | null
  profilePicture?: string | null
  size?: "default" | "sm" | "lg"
  className?: string
}

export function UserAvatar({ name, profilePicUrl, profilePicture, size = "default", className }: UserAvatarProps) {
  // Generate initials from name
  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ')
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  const initials = getInitials(name)

  return (
    <Avatar size={size} className={className}>
      {(profilePicUrl || profilePicture) && (
        <AvatarImage src={getFullImageUrl(profilePicUrl || profilePicture || null) ?? undefined} alt={`${name}'s profile picture`} />
      )}
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}