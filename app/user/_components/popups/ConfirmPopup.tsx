"use client";

import { Button } from "@/components/ui/button";

interface ConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
}

export function ConfirmPopup({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm"
}: ConfirmPopupProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-3xl shadow-2xl p-10 max-w-sm w-full mx-4 border border-border">
        <h3 className="text-2xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="mb-6 text-muted-foreground">{message}</p>
        <div className="flex gap-3 w-full">
          <Button onClick={onClose} variant="outline" className="flex-1 font-semibold">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            className="flex-1 font-semibold border border-destructive text-destructive bg-card hover:bg-destructive hover:text-destructive-foreground shadow-sm hover:shadow-md"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}