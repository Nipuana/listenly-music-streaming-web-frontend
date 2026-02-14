"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Settings, Heart, Play } from "lucide-react";

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>
            Manage your account and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 justify-start p-4">
              <Settings className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Account Settings</div>
                <div className="text-xs text-muted-foreground">Update your profile</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 justify-start p-4">
              <Heart className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Liked Songs</div>
                <div className="text-xs text-muted-foreground">View your favorites</div>
              </div>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 justify-start p-4">
              <Play className="w-6 h-6" />
              <div className="text-left">
                <div className="font-medium">Recent Activity</div>
                <div className="text-xs text-muted-foreground">See what you've played</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}