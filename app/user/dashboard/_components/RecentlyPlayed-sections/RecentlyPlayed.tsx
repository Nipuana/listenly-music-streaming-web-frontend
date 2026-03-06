import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMyPlaylists } from "@/hooks/cashing-hooks/use-my-playlists";
import { getRecentSongs } from "@/lib/cookies/recent-songs-cookie";
import { useEffect, useState } from "react";
import { getSongById } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
import { SongDetailsPopup } from "../../../_components/popups/SongDetailsPopup";
import { ArtistProfilePopup } from "../../../_components/popups/ArtistProfilePopup";
import { usePlaySong } from "@/hooks/player-hooks/use-play-song";

// Import the separated SongItem component
import { SongItem } from "./SongItem";

interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  audioUrl?: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; username?: string; [key: string]: any };
  createdAt?: string;
}

export function RecentlyPlayed({ collapsed = false }: { collapsed?: boolean }) {
  const { playlists } = useMyPlaylists();
  const [recentSongs, setRecentSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isArtistPopupOpen, setIsArtistPopupOpen] = useState(false);
  const { playSingleSong } = usePlaySong();

  useEffect(() => {
    const fetchRecentSongs = async () => {
      setLoading(true);
      try {
        const recentEntries = getRecentSongs();
        const songIds = recentEntries.map(entry => entry.song.id);
        
        // Fetch full song data for each ID
        const songPromises = songIds.map(async (id) => {
          try {
            const response = await getSongById(id);
            if (response?.data) {
              // Transform API response to match Song interface
              const apiSong = response.data;
              const transformedSong: Song = {
                id: apiSong.id || apiSong._id,
                title: apiSong.title,
                artist: apiSong.uploadedBy?.username || 'Unknown Artist',
                genre: apiSong.genre,
                duration: apiSong.duration?.toString() || '0',
                coverImageUrl: apiSong.coverImageUrl,
                audioUrl: apiSong.audioUrl,
                uploadedBy: apiSong.uploadedBy,
                createdAt: apiSong.createdAt,
              };
              return transformedSong;
            }
            return null;
          } catch (error) {
            // Song might be deleted or API error - silently skip
            return null;
          }
        });
        
        const songs = await Promise.all(songPromises);
        // Filter out null results (deleted songs)
        const validSongs = songs.filter(song => song !== null) as Song[];
        
        setRecentSongs(validSongs);
      } catch (error) {
        // Handle any unexpected errors
        setRecentSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentSongs();
  }, []);

  const handleLikeSong = (songId: string) => {
    // TODO: Implement like functionality
    console.log("Like song:", songId);
  };

  const handleAddToPlaylist = (songId: string, playlistId: string) => {
    // TODO: Implement add to playlist functionality
    console.log("Add song", songId, "to playlist", playlistId);
  };

  const handleSongClick = (song: Song) => {
    setSelectedSong(song);
    setIsPopupOpen(true);
  };

  const handlePlaySong = (song: Song) => {
    playSingleSong(song);
  };
  return (
    <>
      <Card className="bg-card/60 backdrop-blur-md border-border/50 shadow-lg">
        <CardHeader>
          <CardTitle>Recently Played</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading recent songs...</div>
            </div>
          ) : recentSongs.length > 0 ? (
            <div className="grid-responsive-auto">
              {recentSongs.map((song) => (
                <SongItem
                  key={song.id}
                  song={song}
                  playlists={playlists}
                  onSongClick={handleSongClick}
                  onPlay={handlePlaySong}
                  onAddToPlaylist={handleAddToPlaylist}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground mb-4">
                Not enough data to track recently played songs
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/user/library'}>
                Explore Library
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <SongDetailsPopup
        song={selectedSong}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onPlay={() => selectedSong && handlePlaySong(selectedSong)}
      />
      <ArtistProfilePopup
        userId={selectedSong?.uploadedBy ? 
          (typeof selectedSong.uploadedBy === 'object' ? 
            selectedSong.uploadedBy._id || selectedSong.uploadedBy.id : 
            selectedSong.uploadedBy) : 
          undefined}
        isOpen={isArtistPopupOpen}
        onClose={() => setIsArtistPopupOpen(false)}
      />
    </>
  );
}
