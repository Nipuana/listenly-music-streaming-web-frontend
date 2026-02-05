"use client";
import { Settings, LogOut, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../../../app/(auth)/context/auth-context";
import { usePathname } from "next/navigation";

export function SettingsSection() {
  const { logout } = useAuth();
  const pathname = usePathname();

  const settingsItems = [
    { href: "/user/feedback", icon: MessageSquare, label: "Feedback" },
  ];

  return (
    <div className="space-y-1">
      {settingsItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Button
            key={href}
            asChild
            variant="ghost"
            className={`w-full justify-start transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-transparent hover:bg-primary/10 hover:text-primary text-muted-foreground"
            }`}
          >
            <Link href={href} className="flex items-center">
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{label}</span>
            </Link>
          </Button>
        );
      })}

      <Button
        onClick={logout}
        variant="ghost"
        className="w-full justify-start hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
      >
        <LogOut className="w-5 h-5 mr-3" />
        <span className="font-medium">Logout</span>
      </Button>
    </div>
  );
}