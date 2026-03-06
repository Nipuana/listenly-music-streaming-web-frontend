"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { AnimatedPopup } from "@/lib/utils/animated-popup";

interface DeletePlaylistConfirmDialogProps {
  isOpen: boolean;
  playlistName?: string;
  onClose: () => void;
  onConfirm: () => void;
  isConfirming?: boolean;
}

export function DeletePlaylistConfirmDialog({
  isOpen,
  playlistName,
  onClose,
  onConfirm,
  isConfirming = false,
}: DeletePlaylistConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const modalContent = (
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      className="bg-card rounded-3xl shadow-2xl p-10 max-w-sm w-full mx-4 border border-border"
      backdropClassName="absolute inset-0 bg-black/50 backdrop-blur-sm"
    >
      <h3 className="text-2xl font-bold mb-2 text-foreground">Delete Playlist</h3>
      <p className="mb-6 text-muted-foreground">
        Are you sure you want to delete{playlistName ? ` \"${playlistName}\"` : " this playlist"}? This action can’t be undone.
      </p>
      <div className="flex gap-3 w-full">
        <Button onClick={onClose} variant="outline" className="flex-1 font-semibold" disabled={isConfirming}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="destructive"
          className="flex-1 font-semibold border border-destructive text-destructive bg-card hover:bg-destructive hover:text-destructive-foreground shadow-sm hover:shadow-md"
          disabled={isConfirming}
        >
          {isConfirming ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </AnimatedPopup>
  );

  return createPortal(modalContent, document.body);
}
