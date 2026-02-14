import { useAuth } from "@/Providers/Contexts/auth-context";
import { getFullImageUrl } from "@/lib/utils/image-util";

interface UseProfilePicReturn {
  src: string | null;
  fallback: string;
}

export const useProfilePic = (): UseProfilePicReturn => {
  const { user } = useAuth();

  const getInitials = (fullName: string) => {
    const names = fullName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  if (!user) {
    return { src: null, fallback: "?" };
  }

  const profilePicUrl = user.profilePicture || user.profilePicUrl || user.profile_pic || null;
  const fullImageUrl = getFullImageUrl(profilePicUrl);
  const name = user.name || user.username || "User";

  return {
    src: fullImageUrl,
    fallback: getInitials(name),
  };
};
