"use client";

import { useEffect, useState } from "react";
import { AnimatedPopup } from "@/lib/utils/animated-popup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/Providers/Contexts/auth-context";
import { handleUpdateData } from "@/lib/actions/auth-acitons";
import { toast } from "react-toastify";

interface EditUsernamePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditUsernamePopup({ isOpen, onClose }: EditUsernamePopupProps) {
  const { user, setUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      setLoading(false);
      return;
    }

    setUsername(user?.username || "");
    setError(null);
  }, [isOpen, user?.username]);

  const handleClose = () => {
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setError("Username is required");
      return;
    }
    setLoading(true);
    try {
      const result = await handleUpdateData({ username: trimmedUsername });
      if (result.success && result.data) {
        toast.success(result.message || "Username updated successfully");
        setUser(result.data);
        handleClose();
      } else {
        setError(result.message || "Update failed");
      }
    } catch (err: any) {
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPopup isOpen={isOpen} onClose={handleClose} className="relative bg-background rounded-xl shadow-2xl max-w-sm w-full mx-4">
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Edit Username</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              disabled={loading}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </AnimatedPopup>
  );
}
