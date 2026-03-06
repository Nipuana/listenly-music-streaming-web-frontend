export function isPlaylistOwnedByUser(playlist: any, user: any): boolean {
  if (!playlist || !user) return false;

  const userId = (user?.id || user?._id || user?.userId || "").toString();
  const username = (user?.username || user?.name || "").toString();

  const matchesUserId = (value: unknown) => {
    if (!value || !userId) return false;
    if (typeof value === "string" || typeof value === "number") {
      return value.toString() === userId;
    }
    if (typeof value === "object") {
      const v: any = value;
      const nestedId = v?._id || v?.id || v?.userId || v?.ownerId;
      if (nestedId) return nestedId.toString() === userId;
    }
    return false;
  };

  const ownerCandidates = [
    (playlist as any)?.userId,
    (playlist as any)?.ownerId,
    (playlist as any)?.createdBy,
    (playlist as any)?.createdById,
    (playlist as any)?.creatorId,
    (playlist as any)?.uploadedBy,
    (playlist as any)?.user,
    (playlist as any)?.owner,
  ];

  if (ownerCandidates.some(matchesUserId)) return true;

  // Fallback: some responses only include a display name.
  const creatorName = ((playlist as any)?.creator || "").toString();
  if (creatorName && username) return creatorName.toLowerCase() === username.toLowerCase();

  return false;
}
