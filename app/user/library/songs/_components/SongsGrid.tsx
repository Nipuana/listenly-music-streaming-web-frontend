"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SongCard } from "./SongCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePlayQueue } from "@/hooks/player-hooks/use-play-queue";

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

interface SongsGridProps {
  title: string;
  songs: Song[];
  onPlaySong?: (songId: string) => void;
}

export function SongsGrid({ title, songs, onPlaySong }: SongsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const totalPages = Math.ceil(songs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSongs = songs.slice(startIndex, endIndex);
  const { playAtIndex } = usePlayQueue(currentSongs);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <Card className="bg-card backdrop-blur-md border-border shadow-lg mb-10">
      <CardHeader className="bg-background-secondary border-b border-border">
        <CardTitle className="text-foreground font-bold text-xl">
          {title} ({songs.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="grid-responsive-auto justify-items-center sm:justify-items-start">
          {currentSongs.map((song, index) => (
            <SongCard
              key={song.id}
              song={song}
              onPlay={() => {
                onPlaySong?.(song.id);
                playAtIndex(index);
              }}
            />
          ))}
        </div>
        
        {totalPages > 1 && (
          <div className="flex items-center justify-center mt-8 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {getPageNumbers().map((page, index) => (
                <div key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-sm text-muted-foreground">...</span>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page as number)}
                      className="w-10 h-10"
                    >
                      {page}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}