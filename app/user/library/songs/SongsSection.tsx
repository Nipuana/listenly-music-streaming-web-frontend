"use client";

import { useState, useMemo } from "react";
import { SearchFilters } from "./_components/SearchFilters";
import { CategoryPills } from "./_components/CategoryPills";
import { BrowseStats } from "./_components/BrowseStats";
import { SongsGrid } from "./_components/SongsGrid";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  audioUrl?: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; [key: string]: unknown };
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

interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
}

interface SongsSectionProps {
  songs: Song[];
  playlists: Playlist[];
}

export function SongsSection({ songs, playlists }: SongsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredSongs = useMemo(() => {
    return Array.isArray(songs) ? songs.filter((song) => {
      const matchesSearch =
        (song?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (song?.artist?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || (song?.genre || '') === selectedCategory;
      return matchesSearch && matchesCategory;
    }) : [];
  }, [songs, searchTerm, selectedCategory]);

  const stats = useMemo(() => [
    { label: "Total songs", value: filteredSongs.length.toString() },
    { label: "Genres", value: new Set(filteredSongs.map(song => song?.genre).filter(Boolean)).size.toString() },
    { label: "Playlists", value: playlists.length.toString() },
  ], [filteredSongs, playlists]);

  const handlePlaySong = (songId: string) => {
    // Handle play song logic here
    console.log("Playing song:", songId);
  };

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