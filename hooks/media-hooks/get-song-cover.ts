import { getFullImageUrl } from "@/lib/utils/image-util";

export const getSongCoverUrl = (coverUrl: string | null | undefined): string => {
  const url = getFullImageUrl(coverUrl || null) || getFullImageUrl("/uploads/defaults/song_default.png") || "";
  return url;
};