import { getFullImageUrl } from "@/lib/utils/image-util";

export const getPlaylistCoverUrl = (coverUrl: string | null | undefined): string => {
  const url = getFullImageUrl(coverUrl || null) || getFullImageUrl("/uploads/defaults/playlist_default.png") || "";
  return url;
};