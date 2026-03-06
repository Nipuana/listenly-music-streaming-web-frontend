"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChangePasswordPopup } from "@/app/user/_components/popups/ChangePasswordPopup";

interface AccountDetailsProps {
  user: any;
}

export function AccountDetails({ user }: AccountDetailsProps) {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <ChangePasswordPopup isOpen={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />
      <div className="grid grid-cols-1 gap-6">
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
              {user?.role === "pUser" ? (
                <Badge variant="secondary">Premium</Badge>
              ) : (
                <Badge variant="outline">Standard</Badge>
              )}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Member Since</span>
              <span className="text-sm text-muted-foreground">
                {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={() => setChangePasswordOpen(true)}>
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}