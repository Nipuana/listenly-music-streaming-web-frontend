"use client";

import { useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useArtistInfo } from "@/hooks/cashing-hooks/use-artist-info";
import { useArtistProfile } from "@/hooks/artist-hooks/use-artist-profile";
import { getFullImageUrl } from "@/lib/utils/image-util";
import { createClientOnlyComponent } from "@/lib/utils/client-only";
import { AnimatedPopup } from "@/lib/utils/animated-popup";
import Image from "next/image";

interface ArtistProfilePopupProps {
  userId?: string;
  isOpen: boolean;
  onClose: () => void;
}

// Create a client-only version of the popup
const ArtistProfilePopupClient = ({ userId, isOpen, onClose }: ArtistProfilePopupProps) => {
  const { artist, loading } = useArtistInfo(userId);
  const { name, profilePicSrc, profilePicFallback } = useArtistProfile(userId);

  const displayName = useMemo(() => {
    if (artist?.name) return artist.name;
    if (artist?.username) return artist.username;
    return name || "Unknown Artist";
  }, [artist, name]);

  const username = useMemo(() => {
    if (!artist?.username) return null;
    return `@${artist.username}`;
  }, [artist]);

  const bio = useMemo(() => {
    const artistAny = artist as any;
    return artistAny?.bio || artistAny?.about || artistAny?.description || "";
  }, [artist]);

  if (!userId) return null;

  const modalContent = (
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      className="relative bg-background rounded-xl shadow-2xl max-w-lg w-full mx-4"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
        aria-label="Close artist profile"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold overflow-hidden">
              {profilePicSrc ? (
                <Image
                  src={getFullImageUrl(profilePicSrc) || ""}
                  alt={displayName}
                  width={80}
                  height={80}
                  unoptimized={true}
                  className="w-full h-full object-cover"
                />
              ) : (
                profilePicFallback
              )}
            </div>
            <h3 className="mt-4 text-xl font-semibold text-foreground">
              {displayName}
            </h3>
            {username && (
              <p className="text-sm text-foreground-muted">
                {username}
              </p>
            )}
          </div>

          <div className="mt-5">
            {loading ? (
              <p className="text-sm text-foreground-muted text-center">Loading artist profile...</p>
            ) : bio ? (
              <p className="text-sm text-foreground-secondary leading-relaxed">
                {bio}
              </p>
            ) : (
              <p className="text-sm text-foreground-muted text-center">No bio available.</p>
            )}
          </div>
        </div>
      </AnimatedPopup>
    );

  return createPortal(modalContent, document.body);
};

// Export the dynamically imported component
export const ArtistProfilePopup = createClientOnlyComponent(ArtistProfilePopupClient);
