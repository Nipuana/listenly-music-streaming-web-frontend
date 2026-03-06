"use client";

import { motion } from "framer-motion";
import { Card, CardHeader } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";
import EditProfilePopup from "@/app/_components/popups/EditProfilePopup";
import { useArtistProfile } from "@/hooks/artist-hooks/use-artist-profile";

interface ArtistProfileHeaderProps {
  user: any;
}

export function ArtistProfileHeader({ user }: ArtistProfileHeaderProps) {
  const userId = user?.id || user?._id;
  const { name, profilePicSrc, profilePicFallback, loading } = useArtistProfile(userId);

  const [editOpen, setEditOpen] = useState(false);

  const displayName = name || user?.username || user?.name || "Artist";

  return (

    <>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-0 shadow-lg bg-linear-to-r from-primary/10 via-secondary/5 to-accent/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-6">
              <button type="button" onClick={() => setEditOpen(true)} className="p-0 rounded-full" aria-label="Edit profile">
                <UserAvatar
                  name={displayName}
                  profilePicture={profilePicSrc}
                  className="w-24 h-24 border-4 border-background shadow-lg cursor-pointer"
                  fallbackClassName="text-2xl bg-primary text-primary-foreground"
                />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">{displayName}</h1>
                  {user?.role === "pUser" && (
                    <Badge variant="secondary" className="px-3 py-1">
                      <Star className="w-4 h-4 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>📧</span>
                    {user?.email || "user@example.com"}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>📅</span>
                    Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <Button variant="outline" className="gap-2" onClick={() => setEditOpen(true)}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Edit Profile
              </Button>
              <EditProfilePopup isOpen={editOpen} onClose={() => setEditOpen(false)} initialUser={user} />
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </>
  );
}
