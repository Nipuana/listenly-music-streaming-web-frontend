"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Star } from "lucide-react";
import { getFullImageUrl } from "@/lib/utils/image-util";

interface ProfileHeaderProps {
  user: any;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 shadow-lg bg-linear-to-r from-primary/10 via-secondary/5 to-accent/10">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
              <AvatarImage
                src={getFullImageUrl(user?.profilePicture)||""}
                alt={user?.name || "User"}
              />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold text-foreground">
                  {user?.name || "User"}
                </h1>
                <Badge variant="secondary" className="px-3 py-1">
                  <Star className="w-4 h-4 mr-1" />
                  Premium
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-4">
                @{user?.username || "username"}
              </p>
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
            <Button variant="outline" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}