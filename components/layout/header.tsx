import { Music } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-primary">
            <Music className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Listenly</h1>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground hover:text-secondary transition-colors">Features</a>
          <a href="#about" className="text-foreground hover:text-secondary transition-colors">About</a>
          <a href="#pricing" className="text-foreground hover:text-secondary transition-colors">Pricing</a>
          <Button asChild variant="ghost" className="text-primary hover:bg-button-ghost-hover">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary-hover">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}