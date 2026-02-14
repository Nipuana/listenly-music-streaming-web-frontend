import { Play, MoreHorizontal, Heart, Plus, ThumbsUp, ThumbsDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMyPlaylists } from "@/hooks/cashing-hooks/use-my-playlists";
import { getRecentSongs } from "@/lib/cookies/recent-songs-cookie";
import { useEffect, useState } from "react";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";
import { getSongById } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
import { useSongLikeStatus } from "@/hooks/cashing-hooks/use-song-like-status";
import { toast } from "react-toastify";
import { SongDetailsPopup } from "../../_components/popups/SongDetailsPopup";
import { ArtistProfilePopup } from "../../_components/popups/ArtistProfilePopup";
import { usePlaySong } from "@/hooks/player-hooks/use-play-song";

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

interface SongItemProps {
  song: Song;
  playlists: any[];
  onSongClick: (song: Song) => void;
  onPlay: (song: Song) => void;
  onAddToPlaylist: (songId: string, playlistId: string) => void;
}

function SongItem({ song, playlists, onSongClick, onPlay, onAddToPlaylist }: SongItemProps) {
  const { isLiked, loading: likeLoading, toggleLikeStatus } = useSongLikeStatus(song.id);

  const handleLikeSong = async () => {
    if (likeLoading) return;

    const wasLiked = isLiked;

    try {
      await toggleLikeStatus();
      
      if (!wasLiked) {
        toast.success("Song liked", {
          icon: <ThumbsUp className="w-4 h-4" />,
          style: { backgroundColor: '#10B981', color: 'white' }
        });
      } else {
        toast.error("Song unliked", {
          icon: <ThumbsDown className="w-4 h-4" />,
          style: { backgroundColor: '#EF4444', color: 'white' }
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      toast.error('Failed to update like status');
    }
  };

  return (
    <Card
      className="group border-border/50 hover:shadow-primary transition-all cursor-pointer overflow-hidden card-responsive"
      onClick={() => onSongClick(song)}
    >
      <CardContent className="p-4">
        <div className="relative mb-3">
          <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={getSongCoverUrl(song.coverImageUrl)}
              alt={song.title}
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            size="icon"
            className="absolute bottom-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-primary bg-gradient-primary"
            onClick={(e) => {
              e.stopPropagation();
              onPlay(song);
            }}
          >
            <Play className="w-4 h-4 ml-0.5 fill-white" />
          </Button>
          <Button
            size="icon"
            className="absolute bottom-2 left-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-gradient-primary hover:scale-110 border-none h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              handleLikeSong();
            }}
            disabled={likeLoading}
          >
            <Heart
              className={`w-4 h-4 text-primary-foreground transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg bg-black/50 hover:bg-black/70 border-none h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleLikeSong(); }} disabled={likeLoading}>
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                {isLiked ? 'Unlike' : 'Like'}
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Playlist
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  {playlists.length > 0 ? (
                    playlists.map((playlist) => (
                      <DropdownMenuItem
                        key={playlist.id}
                        onClick={(e) => { e.stopPropagation(); onAddToPlaylist(song.id, playlist.id); }}
                      >
                        {playlist.name}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No playlists available
                    </DropdownMenuItem>
                  )}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                    {(song.artist || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{song.artist || 'Unknown Artist'}</span>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <h4 className="font-semibold truncate">{song.title}</h4>
        <p className="text-sm text-muted-foreground truncate">{song.artist || 'Unknown Artist'}</p>
      </CardContent>
    </Card>
  );
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
