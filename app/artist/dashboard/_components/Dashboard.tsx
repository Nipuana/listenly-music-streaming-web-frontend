"use client";
import { useEffect, useMemo, useState } from "react";
import { Music, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../../components/ui/table";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { getSongsByUser } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
import { useArtistProfile } from "@/hooks/artist-hooks/use-artist-profile";
import { useUserStats } from "@/hooks/stats-hooks/use-user-stats";

type Track = { id: string; title: string; album?: string; duration?: string; streams: number; hours?: number };

function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function formatHours(seconds?: number) {
  const s = Number(seconds || 0);
  if (!s) return "—";
  const hours = s / 3600;
  return `${hours >= 1 ? hours.toFixed(1) : hours.toFixed(2)}h`;
}

export default function ArtistDashboard() {
  const { user } = useAuth();
  const { name, profilePicSrc, profilePicFallback } = useArtistProfile(user?.id || user?._id);
  const { stats } = useUserStats();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const resp = await getSongsByUser(user?.id || user?._id || "");
        const raw = Array.isArray(resp) ? resp : resp?.data || resp?.songs || [];
        const mapped: Track[] = (Array.isArray(raw) ? raw : []).map((s: any) => ({
          id: s?.id || s?._id,
          title: s?.title || s?.name || "Untitled",
          album: s?.album || s?.release || undefined,
          duration: s?.duration || s?.length || undefined,
          streams: Number(s?.playCount || s?.plays || s?.play_count || 0),
          hours: Number(s?.listenTimeSeconds || s?.listenTime || s?.totalListenTimeSeconds || s?.listen_time_seconds || 0),
        }));
        if (!mounted) return;
        setTracks(mapped.sort((a, b) => (b.streams || 0) - (a.streams || 0)));
      } catch (err) {
        console.error("Failed to load artist songs:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (user) load();
    return () => { mounted = false; };
  }, [user]);

  const totalStreams = useMemo(() => tracks.reduce((s, t) => s + (t.streams || 0), 0), [tracks]);
  

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <Card className="border-none shadow-xl overflow-hidden bg-linear-to-br from-[#283F83] via-[#2d4a99] to-[#476FE9] text-white">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                {profilePicSrc ? <img src={profilePicSrc} alt={name} /> : <AvatarFallback className="bg-white/15 text-white text-2xl font-bold">{profilePicFallback}</AvatarFallback>}
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="text-xs bg-white/20 text-white border-white/30">Artist</Badge>
                  <span className="text-sm text-blue-200">{user?.genre || user?.location || "—"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-xs text-blue-200">Monthly Listeners</div>
                <div className="text-xl font-bold">{formatCount(stats.playlists || 0)}</div>
              </div>
              <div>
                <div className="text-xs text-blue-200">Total Streams</div>
                <div className="text-xl font-bold">{formatCount(totalStreams)}</div>
              </div>
              
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle>Top Tracks</CardTitle>
                <CardDescription>Your best performing songs</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5 w-8">#</TableHead>
                      <TableHead>Track</TableHead>
                      <TableHead className="text-right">Streams</TableHead>
                      <TableHead className="text-right">Hours</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(loading ? new Array(4).fill(null) : tracks.slice(0, 10)).map((t, i) => (
                      t ? (
                        <TableRow key={t.id} className="border-border hover:bg-muted/30">
                          <TableCell className="pl-5 text-muted-foreground">{i+1}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-linear-to-br from-[#283F83] to-[#476FE9] rounded-lg flex items-center justify-center">
                                <Music className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold">{t.title}</div>
                                <div className="text-xs text-muted-foreground">{t.album || "—"} · {t.duration || "—"}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-bold">{formatCount(t.streams || 0)}</TableCell>
                          <TableCell className="text-right font-medium">{formatHours(t.hours)}</TableCell>
                        </TableRow>
                      ) : (
                        <TableRow key={i} className="border-border">
                          <TableCell className="pl-5 text-muted-foreground">&nbsp;</TableCell>
                          <TableCell>
                            <div className="h-4 bg-muted rounded animate-pulse w-48" />
                          </TableCell>
                          <TableCell className="text-right font-bold">&nbsp;</TableCell>
                          <TableCell className="text-right font-bold">&nbsp;</TableCell>
                        </TableRow>
                      )
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>What's been happening</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-linear-to-br from-[#283F83] to-[#476FE9] rounded-lg flex items-center justify-center">
                      <Music className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-foreground">{tracks[0] ? `"${tracks[0].title}" playing well` : 'No recent activity'}</div>
                      <div className="text-xs text-muted-foreground">{tracks[0] ? '2h ago' : ''}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-foreground">{user?.name || 'New followers added'}</div>
                      <div className="text-xs text-muted-foreground">3d ago</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
