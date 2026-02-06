"use client";

import { useState, useEffect, useMemo } from "react";
import { SearchFilters } from "./_components/SearchFilters";
import { CategoryPills } from "./_components/CategoryPills";
import { BrowseStats } from "./_components/BrowseStats";
import { SongsGrid } from "./_components/SongsGrid";
import { getAllSongs } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverUrl: string;
}

const categories = [
  "All",
  "pop",
  "rock",
  "hip-hop",
  "electronic",
  "soul",
  "country",
  "jazz",
  "classical",
  "latin",
  "folk",
  "blues",
  "reggae",
  "metal",
  "gospel",
  "other"
];

export function SongsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        setLoading(true);
        const data = await getAllSongs();
        setSongs(Array.isArray(data) ? data : data?.data || data?.songs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch songs");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const stats = useMemo(() => [
    { label: "Total songs", value: songs.length.toString() },
    { label: "Artists", value: new Set(songs.map(song => song?.artist).filter(Boolean)).size.toString() },
    { label: "Genres", value: new Set(songs.map(song => song?.genre).filter(Boolean)).size.toString() },
    { label: "Albums", value: "0" }, // Placeholder since no album data
  ], [songs]);

  const filteredSongs = Array.isArray(songs) ? songs.filter((song) => {
    const matchesSearch =
      (song?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (song?.artist?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || (song?.genre || '') === selectedCategory;
    return matchesSearch && matchesCategory;
  }) : [];

  const handlePlaySong = (songId: string) => {
    // Handle play song logic here
    console.log("Playing song:", songId);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <div className="text-center py-10">
          <p className="text-foreground-muted">Loading songs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-10">
        <div className="text-center py-10">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <SearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <CategoryPills
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <BrowseStats stats={stats} />
      <SongsGrid
        title={
          selectedCategory === "All"
            ? "All Music"
            : `${selectedCategory} Music`
        }
        songs={filteredSongs}
        onPlaySong={handlePlaySong}
      />
    </div>
  );
}