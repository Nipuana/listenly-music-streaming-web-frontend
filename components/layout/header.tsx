"use client";

import { Music, User, Settings, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogoutConfirmDialog } from "../ui/logout-confirm-dialog";
import { useState } from "react";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { useSidebarState } from "@/Providers/Contexts/SidebarContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { getFullImageUrl } from "@/lib/utils/image-util";

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Listenly" }: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const { setMobileSidebarOpen } = useSidebarState();
  const isMobile = useIsMobile();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName = user?.username || user?.name || user?.fullName || "User";
  const avatarSrc = getFullImageUrl(user?.profilePicture || user?.profilePicUrl || user?.avatar || null) ?? undefined;
  const isArtist = user?.role === "artist";
  const profileHref = isArtist ? "/artist/profile" : "/user/profile";
  const dashboardHref = isArtist ? "/artist/dashboard" : "/user/dashboard";

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <header className="bg-card/60 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAuthenticated && isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileSidebarOpen(true)}
              className="mr-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link href={isAuthenticated ? dashboardHref : "/"} className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary">
              <Music className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">{title}</h1>
          </Link>
        </div>
        <nav className="flex items-center gap-6 max-md:hidden">
          {!isAuthenticated && (
            <>
              <a href="#features" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="text-sm text-foreground/80 hover:text-foreground transition-colors">About</a>
              <a href="#pricing" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Pricing</a>
            </>
          )}
          
          {!isAuthenticated ? (
            <>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:bg-accent">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-accent">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarSrc} alt={displayName} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={profileHref} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref} className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutClick}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
      <LogoutConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </header>
  );
}