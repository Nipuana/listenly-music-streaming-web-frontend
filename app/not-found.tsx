import Link from "next/link";
import { Music, Home, Search, Disc3 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="relative max-w-2xl w-full border-2 shadow-2xl">
        <CardContent className="p-8 md:p-12 text-center space-y-8">
          {/* Animated Music Icon */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-primary/10 w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto border border-primary/20 shadow-primary">
              <Disc3 className="w-12 h-12 md:w-16 md:h-16 text-primary animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* 404 Text */}
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl bg-(--gradient-primary) bg-clip-text text-color-gradient-primary ">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl text-primary">
              Track Not Found
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Oops! Looks like this page hit a wrong note. The track you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/" passHref>
              <Button 
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Link href="/dashboard" passHref>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto"
              >
                <Music className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Popular Links */}
          <div className="pt-8 border-t">
            <p className="text-sm text-muted-foreground mb-4">Popular Pages</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/music-library" passHref>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  Music Library
                </Button>
              </Link>
              <Link href="/playlists" passHref>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  My Playlists
                </Button>
              </Link>
              <Link href="/payment-plans" passHref>
                <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                  Premium Plans
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}