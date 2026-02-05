"use client";
import { Home, Library, Heart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export function MainNavSection() {
  const pathname = usePathname();

  const navItems = [
    { href: "/user/dashboard", icon: Home, label: "Dashboard" },
    { href: "/user/library", icon: Library, label: "Library" },
    { href: "/user/liked", icon: Heart, label: "Liked Songs" },
    { href: "/user/trending", icon: TrendingUp, label: "Trending" },
  ];

  return (
    <div className="space-y-1">
      {navItems.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Button
            key={href}
            asChild
            className={`w-full justify-start transition-all duration-200 ${
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-transparent hover:bg-primary/10 hover:text-primary text-muted-foreground"
            }`}
            variant={isActive ? "default" : "ghost"}
          >
            <Link href={href} className="flex items-center">
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{label}</span>
            </Link>
          </Button>
        );
      })}
    </div>
  );
}