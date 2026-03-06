import z from "zod";

export const createPlaylistSchema = z.object({
  name: z.string().min(1, "Playlist name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  visibility: z.enum(["public", "private"]),
});

export type CreatePlaylistFormValues = z.infer<typeof createPlaylistSchema>;