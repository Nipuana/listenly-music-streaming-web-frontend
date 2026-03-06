"use client";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Music, TrendingUp, BarChart3 } from "lucide-react";
import { getRecentSongs } from "@/lib/cookies/recent-songs-cookie";
import { getSessionSongs } from "@/lib/cookies/session-songs-cookie";
import { getTopGenres, getTotalSongsPlayed } from "@/lib/cookies/genre-counters-cookie";
import { useEffect, useState } from "react";

export function RecentActivity() {
  const [recentSongs, setRecentSongs] = useState<any[]>([]);
  const [sessionSongs, setSessionSongs] = useState<any[]>([]);
  const [topGenres, setTopGenres] = useState<any[]>([]);
  const [totalSongs, setTotalSongs] = useState(0);

  useEffect(() => {
    // Load data from cookies
    const songs = getRecentSongs().slice(0, 3); // Get 3 most recent overall
    const session = getSessionSongs(); // session history
    const genres = getTopGenres(3); // Get top 3 genres
    const total = getTotalSongsPlayed();

    setRecentSongs(songs);
    setSessionSongs(session);
    setTopGenres(genres);
    setTotalSongs(total);
  }, []);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your listening activity and music preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Total Songs Played */}
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Total songs played</p>
                <p className="text-sm text-muted-foreground">{totalSongs} songs</p>
              </div>
            </div>

            {/* Top Genres */}
            {topGenres.length > 0 && (
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Top genres</p>
                  <p className="text-sm text-muted-foreground">
                    {topGenres.map(g => `${g.genre} (${g.count})`).join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Session Songs */}
            {sessionSongs.length > 0 && (
              <>
                <p className="text-sm font-semibold mt-4">This session</p>
                {sessionSongs.map((entry, index) => (
                  <div key={`session-${entry.song.id}-${index}`} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <Music className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{entry.song.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.song.artist} • {formatTimeAgo(entry.playedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Recent Songs */}
            {recentSongs.map((entry, index) => (
              <div key={`${entry.song.id}-${index}`} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{entry.song.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.song.artist} • {formatTimeAgo(entry.playedAt)}
                  </p>
                </div>
              </div>
            ))}

            {/* Fallback if no activity */}
            {totalSongs === 0 && recentSongs.length === 0 && (
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">No recent activity</p>
                  <p className="text-sm text-muted-foreground">Start playing some music to see your activity here</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}