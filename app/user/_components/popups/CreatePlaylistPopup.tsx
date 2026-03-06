"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createPlaylistSchema, CreatePlaylistFormValues } from "../../utils/createPlaylistSchema";
import { createPlaylist } from "@/lib/api/api-calls/user_APIs/playlist_APIs/playlists";
import { refetchMyPlaylists } from "@/hooks/cashing-hooks/use-my-playlists";
import { refetchAllPlaylists } from "@/hooks/cashing-hooks/use-all-playlists";
import { toast } from "react-toastify";
import { createClientOnlyComponent } from "@/lib/utils/client-only";
import { AnimatedPopup } from "@/lib/utils/animated-popup";

// Create a client-only version of the popup
const CreatePlaylistPopupClient = ({ isOpen, onClose, onSuccess }: CreatePlaylistPopupProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

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
      visibility: "public",
    },
  });

  const visibilityValue = watch("visibility");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: CreatePlaylistFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.description) {
        formData.append("description", data.description);
      }
      formData.append("visibility", data.visibility);

      if (coverImage) {
        formData.append("playlistCover", coverImage);
      }

      await createPlaylist(formData);
      toast.success("Playlist created successfully!");
      // Refresh cached playlists so sidebar updates immediately
      void refetchMyPlaylists().catch(() => {});
      void refetchAllPlaylists().catch(() => {});
      reset();
      setCoverImage(null);
      setCoverPreview(null);
      onClose();
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to create playlist");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setCoverImage(null);
    setCoverPreview(null);
    onClose();
  };

  return (
    <AnimatedPopup 
      isOpen={isOpen} 
      onClose={handleClose}
      className="relative bg-background rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
    >
      {/* Close Button */}
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
              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                  <Music className="w-6 h-6" />
                  Create Playlist
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Playlist Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Playlist Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter playlist name"
                    className="border-2 border-border focus:border-primary"
                    {...register("name")}
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your playlist (optional)"
                    rows={3}
                    className="border-2 border-border focus:border-primary resize-none"
                    {...register("description")}
                    disabled={isSubmitting}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                {/* Cover Image Upload */}
                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors bg-card/30">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted flex items-center justify-center border border-border">
                      {coverPreview ? (
                        <img
                          src={coverPreview}
                          alt="Cover preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="cover-upload"
                        disabled={isSubmitting}
                      />
                      <Label
                        htmlFor="cover-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-md cursor-pointer transition-colors font-medium"
                      >
                        <Upload className="w-4 h-4" />
                        Choose Image
                      </Label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Optional. Max 5MB. JPG, PNG, GIF
                      </p>
                    </div>
                  </div>
                </div>

                {/* Privacy Settings */}
                <div className="space-y-3">
                  <Label>Privacy</Label>
                  <RadioGroup
                    value={visibilityValue}
                    onValueChange={(value) => setValue("visibility", value as "public" | "private")}
                    disabled={isSubmitting}
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 transition-colors bg-card/30">
                      <RadioGroupItem
                        value="private"
                        id="private"
                        className="border-2 border-foreground/60 hover:border-primary focus:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground shadow-sm"
                      />
                      <Label htmlFor="private" className="cursor-pointer flex-1">
                        <div>
                          <div className="font-medium text-foreground">Private</div>
                          <div className="text-sm text-muted-foreground">Only you can see this playlist</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-border hover:border-primary/50 transition-colors bg-card/30">
                      <RadioGroupItem
                        value="public"
                        id="public"
                        className="border-2 border-foreground/60 hover:border-primary focus:border-primary data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground shadow-sm"
                      />
                      <Label htmlFor="public" className="cursor-pointer flex-1">
                        <div>
                          <div className="font-medium text-foreground">Public</div>
                          <div className="text-sm text-muted-foreground">Anyone can see and follow this playlist</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Playlist"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </AnimatedPopup>
        );
      };

interface CreatePlaylistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Export the dynamically imported component
export const CreatePlaylistPopup = createClientOnlyComponent(CreatePlaylistPopupClient);