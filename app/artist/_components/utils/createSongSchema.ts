import * as z from "zod";

export const SongSchema = z.object({
  title: z.string().min(1, "Title is required"),
  genre: z.string().optional(),
  visibility: z.enum(["public", "private"]),
  audioFile: z.any().refine((v) => {
    if (!v) return false;
    if (typeof v === "string") return v.length > 0;
    const asAny: any = v;
    // FileList
    if (typeof FileList !== "undefined" && asAny instanceof FileList) {
      const f = (asAny as FileList)[0];
      if (!f) return false;
      const name = String(f.name || "").toLowerCase();
      const mime = f.type || "";
      return mime === "audio/mpeg" || name.endsWith(".mp3");
    }
    // File
    if (typeof File !== "undefined" && asAny instanceof File) {
      const name = String((asAny as File)?.name || "").toLowerCase();
      const mime = (asAny as File)?.type || "";
      return mime === "audio/mpeg" || name.endsWith(".mp3");
    }
    return false;
  }, { message: "Only MP3 files are supported" }),
  coverImage: z.any().optional().refine((f: any) => {
    if (!f) return true;
    if (typeof f === "string") return true;
    if (typeof FileList !== "undefined" && f instanceof FileList) {
      // empty FileList -> treat as no file
      if ((f as FileList).length === 0) return true;
    }
    const realFile = f instanceof File ? f : f instanceof FileList ? f[0] : null;
    if (!realFile) return true;
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    return allowed.includes((realFile as File).type);
  }, { message: "Cover must be an image (jpg, png, gif, webp)" }),
});

export type SongForm = z.infer<typeof SongSchema>;
