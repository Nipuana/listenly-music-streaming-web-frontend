import React from "react";
import { toast } from "react-toastify";

export interface Song {
  id: string;
  _id?: string;
  title: string;
  artist: string;
  album?: string;
  createdAt?: string;
  genre: string;
  duration: string;
  coverImageUrl: string;
  audioUrl?: string;
  addedAt?: string;
  artistProfilePic?: string;
  uploadedBy?: string | { _id?: string; id?: string; [key: string]: unknown };
}

type ConfirmState = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
};

type SetConfirmState = React.Dispatch<React.SetStateAction<ConfirmState>>;
type ConfirmActionRef = React.RefObject<(() => void) | null>;
type SetLocalSongs = React.Dispatch<React.SetStateAction<Song[]>>;

export const createOpenConfirm = (
  setConfirmState: SetConfirmState,
  confirmActionRef: ConfirmActionRef
) => (options: { title: string; message: string; confirmLabel?: string; onConfirm: () => void }) => {
  confirmActionRef.current = options.onConfirm;
  setConfirmState({
    open: true,
    title: options.title,
    message: options.message,
    confirmLabel: options.confirmLabel || "Confirm",
  });
};

export const createHandleConfirm = (
  confirmActionRef: ConfirmActionRef,
  setConfirmState: SetConfirmState
) => () => {
  const action = confirmActionRef.current;
  confirmActionRef.current = null;
  setConfirmState({ open: false, title: "", message: "", confirmLabel: "Confirm" });
  action?.();
};

export const createHandleCancel = (
  confirmActionRef: ConfirmActionRef,
  setConfirmState: SetConfirmState
) => () => {
  confirmActionRef.current = null;
  setConfirmState({ open: false, title: "", message: "", confirmLabel: "Confirm" });
};

export const createHandleUnlike = (setLocalSongs: SetLocalSongs) => (songId: string) => {
  setLocalSongs((prev) => prev.filter((song) => song?.id !== songId));
  toast.info("Removed from liked songs");
};

export const createHandlePlayAll = (
  isPlayingLiked: boolean,
  togglePlay: () => void,
  playAll: () => void
) => () => {
  if (isPlayingLiked) {
    togglePlay();
    return;
  }
  playAll();
};

export const createHandleShuffle = (playShuffled: () => void) => () => {
  playShuffled();
};