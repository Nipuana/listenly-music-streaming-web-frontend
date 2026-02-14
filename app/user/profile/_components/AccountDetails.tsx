"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AccountDetailsProps {
  user: any;
}

export function AccountDetails({ user }: AccountDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your account information and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Email</span>
              <span className="text-sm text-muted-foreground">{user?.email || "user@example.com"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Username</span>
              <span className="text-sm text-muted-foreground">@{user?.username || "username"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Account Type</span>
              <Badge variant="secondary">Premium</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Member Since</span>
              <span className="text-sm text-muted-foreground">
                {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>
              Manage your privacy settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Profile Visibility</span>
              <Badge variant="outline">Public</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Activity Status</span>
              <Badge variant="outline">Visible</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Data Sharing</span>
              <Badge variant="outline">Limited</Badge>
            </div>
            <Button variant="outline" className="w-full mt-4">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}