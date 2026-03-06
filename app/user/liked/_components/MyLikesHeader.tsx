import Link from "next/link";
import { Heart } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MyLikesHeaderProps {
  userName?: string;
  songCount: number;
}

export function MyLikesHeader({ userName, songCount }: MyLikesHeaderProps) {
  const displayName = userName || "Listenly User";

  return (
    <Card className="relative bg-linear-to-br from-background-secondary via-background to-background-tertiary bg-cover bg-center bg-no-repeat mb-8 md:mb-10 overflow-hidden">
      <CardHeader className="p-4 sm:p-6 md:p-8 lg:p-12 bg-linear-to-b from-black/50 to-transparent">
        <Link href="/user/library" className="text-foreground-secondary text-sm font-medium hover:underline block mb-4">
          &larr; Back to Library
        </Link>
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-4 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-primary rounded-xl flex items-center justify-center shadow-lg shrink-0">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-primary-foreground" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-foreground-secondary uppercase mb-1 sm:mb-2">Playlist</p>
            <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground wrap-break-word">Liked Songs</CardTitle>
            <CardDescription className="text-sm sm:text-base text-foreground-secondary mt-1 sm:mt-2">
              {displayName} • {songCount} song{songCount === 1 ? "" : "s"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}