"use client";
import { LogOut, MessageSquare, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useThemeToggle } from "../../../../hooks/use-theme-toggle";

interface SettingsSectionProps {
  onLogout?: () => void;
}

export function SettingsSection({ onLogout }: SettingsSectionProps) {
  const pathname = usePathname();
  const { toggleTheme, isDark, mounted } = useThemeToggle();

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
        onClick={toggleTheme}
        variant="ghost"
        className="w-full justify-start hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
      >
        {mounted ? (isDark ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />) : <Sun className="w-5 h-5 mr-3" />}
        <span className="font-medium">{mounted ? (isDark ? "Dark Mode" : "Light Mode") : "Theme Toggle"}</span>
      </Button>

      <Button
        onClick={onLogout}
        variant="ghost"
        className="w-full justify-start hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors"
      >
        <LogOut className="w-5 h-5 mr-3" />
        <span className="font-medium">Logout</span>
      </Button>
    </div>
  );
}