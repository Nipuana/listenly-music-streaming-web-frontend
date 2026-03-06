"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserAvatar } from "@/components/ui/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Star } from "lucide-react";
import { useState } from "react";
import EditProfilePopup from "@/app/_components/popups/EditProfilePopup";

interface ProfileHeaderProps {
  user: any;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [editOpen, setEditOpen] = useState(false);
  const displayName = user?.username || user?.name || user?.fullName || user?.email || "User";
  const profilePicture = user?.profilePicture || user?.profilePicUrl || user?.avatar || null;

  return (
    <>
      <EditProfilePopup isOpen={editOpen} onClose={() => setEditOpen(false)} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-lg bg-linear-to-r from-primary/10 via-secondary/5 to-accent/10">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-6">
              <UserAvatar
                name={displayName}
                profilePicture={profilePicture}
                className="w-24 h-24 border-4 border-background shadow-lg"
                fallbackClassName="text-2xl bg-primary text-primary-foreground"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold text-foreground">
                    {displayName}
                  </h1>
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
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </>
  );
}