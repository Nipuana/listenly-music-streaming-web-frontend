export function isPlaylistPublic(playlist: any): boolean {
  if (!playlist || typeof playlist !== "object") return false;

  // common boolean flags
  if (typeof playlist.isPublic === "boolean") return playlist.isPublic;
  if (typeof playlist.isPrivate === "boolean") return !playlist.isPrivate;
  if (typeof playlist.private === "boolean") return !playlist.private;
  if (typeof playlist.public === "boolean") return playlist.public;

  // sometimes booleans come back as strings
  if (typeof playlist.isPublic === "string") {
    const v = playlist.isPublic.toLowerCase();
    if (v === "true") return true;
    if (v === "false") return false;
  }
  if (typeof playlist.isPrivate === "string") {
    const v = playlist.isPrivate.toLowerCase();
    if (v === "true") return false;
    if (v === "false") return true;
  }

  // visibility enums
  const visibility = (playlist.visibility || playlist.privacy || playlist.access || "")
    .toString()
    .toLowerCase();
  if (visibility) return visibility === "public";

  // default: treat unknown as private to be safe
  return false;
}
