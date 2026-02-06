import { LibraryHeader } from "./_components/LibraryHeader";
import { SongsSection } from "./songs/SongsSection";
import { PlaylistsSection } from "./playlists/PlaylistsSection";

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <LibraryHeader
        title="Music Library"
        subtitle="Explore your saved music, playlists, and recent discoveries."
        ctaHref="/user/dashboard"
        ctaLabel="Back to dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SongsSection />
        <PlaylistsSection />
      </div>
    </div>
  );
}