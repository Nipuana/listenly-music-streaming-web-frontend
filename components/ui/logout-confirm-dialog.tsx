"use client";

import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { AnimatedPopup } from "@/lib/utils/animated-popup";
import { useEffect, useState } from "react";

interface LogoutConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({ isOpen, onClose, onConfirm }: LogoutConfirmDialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modalContent = (
    <AnimatedPopup
      isOpen={isOpen}
      onClose={onClose}
      className="bg-card rounded-3xl shadow-2xl p-10 max-w-sm w-full mx-4 border border-border"
      backdropClassName="absolute inset-0 bg-black/50 backdrop-blur-sm"
    >
        <h3 className="text-2xl font-bold mb-2 text-foreground">Confirm Logout</h3>
        <p className="mb-6 text-muted-foreground">Are you sure you want to log out?</p>
        <div className="flex gap-3 w-full">
          <Button onClick={onClose} variant="outline" className="flex-1 font-semibold">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="destructive"
            className="flex-1 font-semibold border border-destructive text-destructive bg-card hover:bg-destructive hover:text-destructive-foreground shadow-sm hover:shadow-md"
          >
            Logout
          </Button>
        </div>
      </AnimatedPopup>
    );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}