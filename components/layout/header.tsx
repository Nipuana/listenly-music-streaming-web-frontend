import { Music, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { getAuthToken, getUserData, clearAuthCookies } from "@/lib/cookies/user-data-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

async function handleLogout() {
  "use server";
  await clearAuthCookies();
}

export default async function Header() {
  const token = await getAuthToken();
  const userData = await getUserData();

  return (
    <header className="bg-card/60 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href={token ? "/user/dashboard" : "/"} className="flex items-center gap-2.5 cursor-pointer">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary">
            <Music className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Listenly</h1>
        </Link>
        <nav className="flex items-center gap-6">
          {!token && (
            <>
              <a href="#features" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Features</a>
              <a href="#about" className="text-sm text-foreground/80 hover:text-foreground transition-colors">About</a>
              <a href="#pricing" className="text-sm text-foreground/80 hover:text-foreground transition-colors">Pricing</a>
            </>
          )}
          
          {!token ? (
            <>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:bg-accent">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-[linear-gradient(to_right,var(--primary),var(--secondary))] text-white hover:opacity-90">
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-accent">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={userData?.avatar} alt={userData?.name || "User"} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userData?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/user/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/dashboard" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form action={handleLogout}>
                    <button type="submit" className="flex w-full items-center cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>
      </div>
    </header>
  );
}