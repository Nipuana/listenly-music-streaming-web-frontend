import Link from "next/link";
import { Music, Home, Search, Disc3 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#476FE9]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#283F83]/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="relative max-w-2xl w-full border-2 shadow-2xl">
        <CardContent className="p-8 md:p-12 text-center space-y-8">
          {/* Animated Music Icon */}
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-linear-to-r from-[#283F83] to-[#476FE9] rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <div className="relative bg-linear-to-r from-[#283F83] to-[#476FE9] w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center mx-auto">
              <Disc3 className="w-12 h-12 md:w-16 md:h-16 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
          </div>

          {/* 404 Text */}
          <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl bg-linear-to-r from-[#283F83] to-[#476FE9] bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl md:text-3xl text-[#283F83]">
              Track Not Found
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Oops! Looks like this page hit a wrong note. The track you're looking for doesn't exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/" passHref>
              <Button 
                size="lg"
                className="bg-linear-to-r from-[#283F83] to-[#476FE9] hover:opacity-90 transition-opacity w-full sm:w-auto"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <Link href="/dashboard" passHref>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-[#476FE9] text-[#476FE9] hover:bg-[#476FE9] hover:text-white w-full sm:w-auto"
              >
                <Music className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          {/* Popular Links */}
          <div className="pt-8 border-t">
            <p className="text-sm text-gray-500 mb-4">Popular Pages</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/music-library" passHref>
                <Button variant="ghost" size="sm" className="text-[#476FE9] hover:bg-[#476FE9]/10">
                  Music Library
                </Button>
              </Link>
              <Link href="/playlists" passHref>
                <Button variant="ghost" size="sm" className="text-[#476FE9] hover:bg-[#476FE9]/10">
                  My Playlists
                </Button>
              </Link>
              <Link href="/payment-plans" passHref>
                <Button variant="ghost" size="sm" className="text-[#476FE9] hover:bg-[#476FE9]/10">
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