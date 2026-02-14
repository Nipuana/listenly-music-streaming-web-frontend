import { useLikedSongsCount } from './use-liked-songs-count';
import { usePlaylistsCount } from './use-playlists-count';
import { useHoursListened } from './use-hours-listened';

export interface UserStats {
  likedSongs: number;
  playlists: number;
  hoursListened: number;

}

export const useUserStats = () => {
  const { count: likedSongs, loading: likedSongsLoading, error: likedSongsError } = useLikedSongsCount();
  const { count: playlists, loading: playlistsLoading, error: playlistsError } = usePlaylistsCount();
  const { hours: hoursListened, loading: hoursLoading, error: hoursError } = useHoursListened();


  const loading = likedSongsLoading || playlistsLoading || hoursLoading ;
  const error = likedSongsError || playlistsError || hoursError;

  const stats: UserStats = {
    likedSongs,
    playlists,
    hoursListened,
   
  };

  return { stats, loading, error };
};