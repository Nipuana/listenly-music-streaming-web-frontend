"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { createSong } from "@/lib/api/api-calls/user_APIs/song_APIs/songs";
import { AnimatedPopup } from "@/lib/utils/animated-popup";
import { createClientOnlyComponent } from "@/lib/utils/client-only";
import { SongSchema, type SongForm } from "../utils/createSongSchema";
import GenreSelect from "../GenreSelect";
import { Music, Image, Upload, FileText } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const CreateSongPopupClient = ({ isOpen, onClose, onSuccess }: Props) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SongForm>({ resolver: zodResolver(SongSchema), defaultValues: { visibility: "public" } });

  const watchedAudio = watch("audioFile");
  const watchedCover = watch("coverImage");
  const watchedGenre = watch("genre");

  const [audioPreview, setAudioPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    let file: File | undefined | null = null;
    if (!watchedAudio) {
      setAudioPreview(null);
      return;
    }
    if ((watchedAudio as any) instanceof File) file = watchedAudio as File;
    else if ((watchedAudio as any) instanceof FileList) file = ((watchedAudio as unknown) as FileList)[0] ?? null;
    else file = null;

    if (!file) {
      setAudioPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setAudioPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [watchedAudio]);

  useEffect(() => {
    let file: File | undefined | null = null;
    if (!watchedCover) {
      setCoverPreview(null);
      return;
    }
    if ((watchedCover as any) instanceof File) file = watchedCover as File;
    else if ((watchedCover as any) instanceof FileList) file = ((watchedCover as unknown) as FileList)[0] ?? null;
    else file = null;

    if (!file) {
      setCoverPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [watchedCover]);

  const submit = async (data: SongForm) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.genre) formData.append("genre", data.genre);
      formData.append("visibility", data.visibility);
      if (data.audioFile) {
        const a = data.audioFile as any;
        const audioToAppend = a instanceof FileList ? a[0] : a;
        if (audioToAppend) formData.append("audioFile", audioToAppend as File);
      }
      if (data.coverImage) {
        const c = data.coverImage as any;
        const coverCandidate = (c instanceof FileList ? ((c as unknown) as FileList)[0] : c) as any;
        // Only append if it's an actual File — skip strings/URLs (edit mode)
        if (coverCandidate instanceof File) {
          formData.append("coverImage", coverCandidate as File);
        }
      }

      await createSong(formData);
      toast.success("Song uploaded");
      reset();
      setAudioPreview(null);
      setCoverPreview(null);
      onClose();
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload song. Ensure the audio is an MP3 and try again.");
    }
  };

  const handleClose = () => {
    reset();
    setAudioPreview(null);
    setCoverPreview(null);
    onClose();
  };

  return (
    <AnimatedPopup isOpen={isOpen} onClose={handleClose} className="relative bg-background rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Upload Song</h2>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-6">
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
            <GenreSelect value={watchedGenre as string | undefined} onChange={(v) => setValue("genre", v)} />
            {errors.genre && <p className="text-sm text-destructive">{(errors.genre as any)?.message}</p>}
          </div>

          {/* Audio upload area */}
          <div>
            <Label className="mb-2">Audio</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 flex items-center gap-4 bg-card/40">
              <div className="flex flex-col items-center justify-center w-28 h-28 bg-muted/30 rounded">
                <Music className="w-10 h-10 text-muted-foreground" />
                <div className="text-xs text-muted-foreground mt-2">MP3 only</div>
              </div>
              <div className="flex-1">
                <p className="font-medium">Upload audio file</p>
                <p className="text-sm text-muted-foreground">Select an MP3 file (max 15MB). We'll stream this as your song.</p>
                <div className="mt-3 flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span className="text-sm">Choose audio</span>
                    <input type="file" accept="audio/*" className="hidden" {...register("audioFile")} />
                  </label>
                  {audioPreview && <audio controls src={audioPreview} className="w-full" />}
                </div>
                {errors.audioFile && <p className="text-sm text-destructive mt-2">{(errors.audioFile as any)?.message}</p>}
              </div>
            </div>
          </div>

          {/* Cover upload area */}
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
                <p className="font-medium">Add a cover image</p>
                <p className="text-sm text-muted-foreground">Square image is recommended (800x800). JPG/PNG/WebP accepted.</p>
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
            <Button type="submit" className="flex-1" disabled={isSubmitting}>{isSubmitting ? "Uploading..." : "Upload Song"}</Button>
          </div>
        </form>
      </div>
    </AnimatedPopup>
  );
};

export const CreateSongPopup = createClientOnlyComponent(CreateSongPopupClient);
