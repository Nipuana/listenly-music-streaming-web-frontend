"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { X, Music, Loader2 } from "lucide-react";

import { AnimatedPopup } from "@/lib/utils/animated-popup";
import { createClientOnlyComponent } from "@/lib/utils/client-only";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { createPlaylistSchema, type CreatePlaylistFormValues } from "../../utils/createPlaylistSchema";
import { getPlaylistById, updatePlaylist } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlists";
import { getPlaylistCoverUrl } from "@/hooks/media-hooks/get-playlist-cover";

interface EditPlaylistPopupProps {
  isOpen: boolean;
  playlistId: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditPlaylistPopupClient = ({ isOpen, playlistId, onClose, onSuccess }: EditPlaylistPopupProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [lastObjectUrl, setLastObjectUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreatePlaylistFormValues>({
    resolver: zodResolver(createPlaylistSchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: "public",
    },
  });

  const visibilityValue = watch("visibility");

  const safeId = useMemo(() => (playlistId || "").toString(), [playlistId]);

  useEffect(() => {
    if (!isOpen) return;
    if (!safeId) return;

    let cancelled = false;
    setIsLoading(true);

    (async () => {
      try {
        const resp: any = await getPlaylistById(safeId);
        const playlist = resp && typeof resp === "object" ? resp.data || resp.playlist || resp : resp;
        if (cancelled) return;

        reset({
          name: playlist?.name || "",
          description: playlist?.description || "",
          visibility: (playlist?.visibility || playlist?.privacy || playlist?.access || "public")?.toString()?.toLowerCase() === "private" ? "private" : "public",
        });

        // set existing cover preview if available
        const rawCover = playlist?.coverImageUrl || playlist?.coverUrl || (playlist as any)?.coverImage || (playlist as any)?.coverImagePath || "";
        setCoverPreview(rawCover ? getPlaylistCoverUrl(rawCover) : null);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load playlist");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isOpen, safeId, reset]);

  useEffect(() => {
    return () => {
      if (lastObjectUrl) {
        URL.revokeObjectURL(lastObjectUrl);
      }
    };
  }, [lastObjectUrl]);

  const onSubmit = async (data: CreatePlaylistFormValues) => {
    if (!safeId) return;
    setIsSubmitting(true);
    try {
      // If a new cover file was chosen, send as FormData
      if (coverFile) {
        const form = new FormData();
        form.append("name", data.name);
        form.append("description", data.description || "");
        form.append("visibility", data.visibility || "public");
        form.append("playlistCover", coverFile);

        await updatePlaylist(safeId, form);
      } else {
        await updatePlaylist(safeId, {
          name: data.name,
          description: data.description,
          visibility: data.visibility,
        });
      }

      toast.success("Playlist updated successfully!");
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update playlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <AnimatedPopup
      isOpen={isOpen}
      onClose={handleClose}
      className="relative bg-background rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
        disabled={isSubmitting}
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Music className="w-6 h-6" />
            Edit Playlist
          </h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading playlist...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Playlist Name *</Label>
              <Input
                id="name"
                placeholder="Enter playlist name"
                {...register("name")}
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add a description (optional)"
                rows={4}
                {...register("description")}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <input
                ref={fileInputRef}
                id="playlistCover"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                  setCoverFile(f);
                  if (f) {
                    if (lastObjectUrl) {
                      URL.revokeObjectURL(lastObjectUrl);
                    }
                    const url = URL.createObjectURL(f);
                    setCoverPreview(url);
                    setLastObjectUrl(url);
                  } else {
                    if (lastObjectUrl) {
                      URL.revokeObjectURL(lastObjectUrl);
                      setLastObjectUrl(null);
                    }
                    setCoverPreview(null);
                  }
                }}
                disabled={isSubmitting}
                className="hidden"
              />

              <div className="flex items-start gap-4">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
                  className="w-48 h-48 rounded-md overflow-hidden bg-muted cursor-pointer border border-border flex items-center justify-center"
                >
                  {coverPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coverPreview} alt="cover preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-sm text-muted-foreground">Click to choose cover</div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Button onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
                    {coverFile ? "Change Image" : "Choose Image"}
                  </Button>
                  {coverFile && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCoverFile(null);
                        setCoverPreview(null);
                        if (lastObjectUrl) {
                          URL.revokeObjectURL(lastObjectUrl);
                          setLastObjectUrl(null);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      Remove
                    </Button>
                  )}
                  <div className="text-sm text-muted-foreground">Recommended: square image (e.g. 600×600)</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Visibility</Label>
              <RadioGroup
                value={visibilityValue}
                onValueChange={(value) => setValue("visibility", value as any)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 rounded-lg border border-border p-4">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="cursor-pointer">
                    Public
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border border-border p-4">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="cursor-pointer">
                    Private
                  </Label>
                </div>
              </RadioGroup>
              {errors.visibility && (
                <p className="text-sm text-destructive">{errors.visibility.message}</p>
              )}
            </div>

            <div className="flex gap-3 w-full">
              <Button type="button" onClick={handleClose} variant="outline" className="flex-1" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting || !safeId}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AnimatedPopup>
  );
};

export const EditPlaylistPopup = createClientOnlyComponent(EditPlaylistPopupClient);
