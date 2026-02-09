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
      <CardHeader className="p-8 md:p-12 bg-linear-to-b from-black/50 to-transparent">
        <Link href="/user/library" className="text-foreground-secondary text-sm font-medium hover:underline">
          &larr; Back to Library
        </Link>
        <div className="flex items-center gap-6 mt-6">
          <div className="w-24 h-24 bg-primary rounded-lg flex items-center justify-center shadow-lg">
            <Heart className="w-12 h-12 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground-secondary uppercase mb-2">Playlist</p>
            <CardTitle className="text-5xl font-extrabold text-foreground">Liked Songs</CardTitle>
            <CardDescription className="text-lg text-foreground-secondary mt-2">
              {displayName} • {songCount} song{songCount === 1 ? "" : "s"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}