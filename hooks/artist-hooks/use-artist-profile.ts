import { useArtistInfo } from './use-artist-info';

interface UseArtistProfileReturn {
  name: string;
  profilePicSrc: string | null;
  profilePicFallback: string;
  loading: boolean;
  error: string | null;
}

export const useArtistProfile = (userId?: string): UseArtistProfileReturn => {
  const { artist, loading, error } = useArtistInfo(userId);

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  if (!artist) {
    return {
      name: 'Unknown Artist',
      profilePicSrc: null,
      profilePicFallback: 'U',
      loading,
      error
    };
  }

  const profilePicUrl = artist.profilePicture || artist.profilePicUrl || artist.profile_pic || null;
  const name = artist.name || artist.username || 'Unknown Artist';

  return {
    name,
    profilePicSrc: profilePicUrl,
    profilePicFallback: getInitials(name),
    loading,
    error
  };
};