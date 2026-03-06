"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";
import { useMySongs } from "@/hooks/cashing-hooks/use-my-songs";

export function ArtistProfileStats() {
  const { songs = [], loading } = useMySongs() as any;
  const uploadedCount = Array.isArray(songs) ? songs.length : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uploaded Songs</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "—" : (uploadedCount || 0).toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
