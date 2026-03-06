"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music, Heart } from "lucide-react";
import { useLikedSongsCount } from "@/hooks/stats-hooks/use-liked-songs-count";
import { useFavoritedPlaylistsCount } from "@/hooks/stats-hooks/use-favorited-playlists-count";

export function ProfileStats() {
  const { count: likedCount = 0, loading: likedLoading } = useLikedSongsCount();
  const { count: favCount = 0, loading: favLoading } = useFavoritedPlaylistsCount();
  const loading = likedLoading || favLoading;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liked Songs</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : (likedCount || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorited Playlists</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "—" : (favCount || 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
