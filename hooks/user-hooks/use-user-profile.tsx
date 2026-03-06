"use client";

import { useState } from "react";
import { handleUpdateData } from "@/lib/actions/auth-acitons";
import { useAuth } from "@/Providers/Contexts/auth-context";

export default function useUserProfile() {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  async function updateProfile(payload: any) {
    setLoading(true);
    setError(null);
    try {
      const result = await handleUpdateData(payload);
      if (result?.success) {
        if (result.data) setUser(result.data);
        // notify other hooks/components that profile updated
        try {
          window.dispatchEvent(new CustomEvent('profileUpdated', { detail: { user: result.data } }));
        } catch (e) {
          // ignore for non-browser contexts
        }
        return { success: true, data: result.data };
      }
      setError(result?.message || 'Update failed');
      return { success: false, message: result?.message };
    } catch (err: any) {
      setError(err?.message || err);
      return { success: false, message: err?.message || String(err) };
    } finally {
      setLoading(false);
    }
  }

  return { updateProfile, loading, error } as const;
}
