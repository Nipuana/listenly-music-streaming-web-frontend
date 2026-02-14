import { Music } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export function NoLikedSongsAlert() {
  return (
    <Alert className="mt-8 md:mt-12 bg-gradient-primary border-none text-primary-foreground shadow-xl card-responsive">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center shrink-0">
          <Music className="w-6 h-6 text-primary-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <AlertTitle className="text-responsive-xl font-bold text-primary-foreground">
            No Liked Songs Yet
          </AlertTitle>
          <AlertDescription className="text-primary-foreground/90 text-responsive-base font-medium mt-2">
            Start exploring and liking songs to build your collection.
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
}