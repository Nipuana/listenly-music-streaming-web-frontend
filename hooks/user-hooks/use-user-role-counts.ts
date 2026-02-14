import { useArtistsCount } from './use-artists-count';
import { usePremiumUsersCount } from './use-premium-users-count';

export interface UserRoleCounts {
  artists: number;
  premiumUsers: number;
}

export const useUserRoleCounts = () => {
  const { count: artists, loading: artistsLoading, error: artistsError } = useArtistsCount();
  const { count: premiumUsers, loading: premiumUsersLoading, error: premiumUsersError } = usePremiumUsersCount();

  const loading = artistsLoading || premiumUsersLoading;
  const error = artistsError || premiumUsersError;

  const roleCounts: UserRoleCounts = {
    artists,
    premiumUsers,
  };

  return { roleCounts, loading, error };
};