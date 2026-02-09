import Link from "next/link";
import { Music } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; [key: string]: unknown };
}

interface LikedSongsOverviewProps {
  songs: Song[];
}

export function LikedSongsOverview({ songs }: LikedSongsOverviewProps) {
  const likedCount = songs.length;

  return (
    <div className="mt-8 md:mt-12 rounded-2xl border border-dashed border-border/60 bg-linear-to-b from-background/80 to-background-secondary/80 p-8 md:p-12 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-muted/40">
        <Music className="h-6 w-6 text-foreground-muted" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground md:text-xl">
        Want to hear more?
      </h3>
      <p className="mt-2 text-sm text-foreground-muted md:text-base">
        Discover new music based on your {likedCount} liked song
        {likedCount === 1 ? "" : "s"}.
      </p>
      <Button
        asChild
        className="mt-5 rounded-full bg-primary px-6 py-2 text-primary-foreground shadow-md hover:bg-primary/90"
      >
        <Link href="/user/library">Check out Library</Link>
      </Button>
    </div>
  );
}