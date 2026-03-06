"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { updateSong } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
import { AnimatedPopup } from "@/lib/utils/animated-popup";
import { createClientOnlyComponent } from "@/lib/utils/client-only";
import * as z from "zod";
import { SongSchema } from "../utils/createSongSchema";
import GenreSelect from "../GenreSelect";
import { Image, FileText } from "lucide-react";
import { getSongCoverUrl } from "@/hooks/media-hooks/get-song-cover";

// For edit form we don't require audio upload — omit audioFile from the schema
const EditSchema = SongSchema.omit({ audioFile: true });

type Props = {
  isOpen: boolean;
  onClose: () => void;
  song?: any;
  onSuccess?: () => void;
};

function EditSongPopup({ isOpen, onClose, song, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof EditSchema>>({ resolver: zodResolver(EditSchema), defaultValues: { visibility: "public" } as any });

  const watchedCover = watch("coverImage");

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Initialize form when song prop changes
  useEffect(() => {
    if (!song) return;
    setValue("title", song.title || song.name || "");
    setValue("genre", song.genre || song.tags || song?.genre || undefined);
    setValue("visibility", song.visibility || "public");
    // For cover we store existing URL (string) so schema accepts it
    setValue("coverImage", song.coverImageUrl || song.coverUrl || song.cover || "");

    // Use helper to convert stored path to full URL
    setCoverPreview(getSongCoverUrl(song.coverImageUrl || song.coverUrl || song.cover || null));
  }, [song, setValue]);
  useEffect(() => {
    let file: File | undefined | null = null;
    if (!watchedCover) {
      if (song && (song.coverImageUrl || song.cover)) return;
      setCoverPreview(null);
      return;
    }
    const asAny: any = watchedCover;
    if (typeof File !== "undefined" && asAny instanceof File) file = asAny as File;
    else if (typeof FileList !== "undefined" && asAny instanceof FileList) file = ((asAny as unknown) as FileList)[0] ?? null;
    else file = null;

    if (!file) {
      setCoverPreview(getSongCoverUrl(song && (song.coverImageUrl || song.cover) ? (song.coverImageUrl || song.cover) : null));
      return;
    }

    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [watchedCover, song]);

  const submit = async (data: z.infer<typeof EditSchema>) => {
    if (!song || !(song.id || song._id)) {
      toast.error("Missing song ID");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.genre) formData.append("genre", data.genre);
      formData.append("visibility", data.visibility);

      if (data.coverImage) {
        const c = data.coverImage as any;
        const coverCandidate = (typeof FileList !== "undefined" && c instanceof FileList) ? ((c as unknown) as FileList)[0] : c;
        if (coverCandidate instanceof File) formData.append("coverImage", coverCandidate as File);
      }

      await updateSong(String(song.id || song._id), formData);
      toast.success("Song updated");
      reset();
      setCoverPreview(null);
      onClose();
      onSuccess?.();
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message || err?.response?.data?.error;
      const msg = apiMessage || err?.message || "Failed to update song";
      toast.error(msg);
    }
  };

  const handleClose = () => {
    reset();
    setCoverPreview(null);
    onClose();
  };

  return (
    <AnimatedPopup isOpen={isOpen} onClose={handleClose} className="relative bg-background rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Edit Song</h2>
        </div>

        <form
          onSubmit={handleSubmit(submit, (formErrors) => {
            const first = Object.values(formErrors)[0] as any;
            const msg = first?.message || "Please fix the highlighted fields";
            toast.error(msg);
          })}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <input
              id="title"
              placeholder="Song title"
              className="w-full rounded-md border border-border px-3 py-2 bg-input"
              {...register("title")}
              disabled={isSubmitting}
            />
            {errors.title && <p className="text-sm text-destructive">{(errors.title as any)?.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Genre</Label>
            <GenreSelect value={watch("genre") as string | undefined} onChange={(v) => setValue("genre", v)} />
            {errors.genre && <p className="text-sm text-destructive">{(errors.genre as any)?.message}</p>}
          </div>

          {/* Audio upload removed for edit popup — keep existing audio if none provided */}

          <div>
            <Label className="mb-2">Cover Image (optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 flex items-center gap-4 bg-card/30">
              <div className="w-28 h-28 rounded overflow-hidden flex items-center justify-center bg-muted">
                {coverPreview ? (
                  <img src={coverPreview} alt="cover preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Image className="w-8 h-8" />
                    <div className="text-xs mt-2">No cover</div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">Change cover image</p>
                <p className="text-sm text-muted-foreground">Leave empty to keep existing cover.</p>
                <div className="mt-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm">Choose image</span>
                    <input type="file" accept="image/*" className="hidden" {...register("coverImage")} />
                  </label>
                </div>
                {errors.coverImage && <p className="text-sm text-destructive mt-2">{(errors.coverImage as any)?.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1" disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
          </div>
        </form>
      </div>
    </AnimatedPopup>
  );
}

export default createClientOnlyComponent(EditSongPopup);
