import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  userName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({ open, userName, onClose, onConfirm }: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-background-secondary dark:bg-card rounded-3xl shadow-2xl p-10 max-w-sm w-full mx-4 animate-in zoom-in-95 duration-200 border-2 border-border">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-destructive/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-9 h-9 text-destructive" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-destructive">Delete User</h3>
          <p className="mb-6 text-base text-foreground-secondary">
            Are you sure you want to delete <span className="font-semibold text-foreground">{userName}</span>?<br />
            <span className="text-destructive font-semibold">This action cannot be undone.</span>
          </p>
          <div className="flex gap-3 w-full mt-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 font-semibold border border-border hover:bg-muted hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              variant="destructive"
              className="flex-1 font-semibold border border-destructive text-destructive bg-white hover:bg-destructive hover:text-white shadow-sm hover:shadow-md"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
