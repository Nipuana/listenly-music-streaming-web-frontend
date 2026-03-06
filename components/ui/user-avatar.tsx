"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getFullImageUrl } from "@/lib/utils/image-util"

interface UserAvatarProps {
  name: string
  profilePicUrl?: string | null
  profilePicture?: string | null
  size?: "default" | "sm" | "lg"
  className?: string
  fallbackClassName?: string
}

export function UserAvatar({ name, profilePicUrl, profilePicture, size = "default", className, fallbackClassName = "bg-gradient-primary text-primary-foreground" }: UserAvatarProps) {
  // Generate initials from name
  const getInitials = (fullName: string) => {
    const cleaned = (fullName || "")
      .trim()
      .replace(/^@+/, "")
      .split("@")[0]

    if (!cleaned) return "U"

    const parts = cleaned.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }

    const token = parts[0] || cleaned
    const alphaNum = token.replace(/[^a-zA-Z0-9]/g, "")
    if (alphaNum.length >= 2) return alphaNum.slice(0, 2).toUpperCase()
    return (alphaNum[0] || token[0] || "U").toUpperCase()
  }

  const initials = getInitials(name)

  return (
    <Avatar size={size} className={className}>
      {(profilePicUrl || profilePicture) && (
        <AvatarImage src={getFullImageUrl(profilePicUrl || profilePicture || null) ?? undefined} alt={`${name}'s profile picture`} />
      )}
      <AvatarFallback className={fallbackClassName}>{initials}</AvatarFallback>
    </Avatar>
  )
}