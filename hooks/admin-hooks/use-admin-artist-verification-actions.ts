import { useCallback, useState } from "react";
import axios from "@/lib/api/axios";
import { API } from "@/lib/api/endpoints";

function extractError(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return String(err);
  } catch {
    return "An unknown error occurred";
  }
}

export function useAdminArtistVerificationActions(onDone?: () => unknown | Promise<unknown>) {
  const [approving, setApproving] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approveRequest = useCallback(
    async (requestId: string, adminNote?: string) => {
      setError(null);
      setApproving(true);
      try {
        const resp = await axios.patch(API.AD_ARTIST_VERIFICATION.APPROVE(requestId), {
          adminNote: adminNote ?? "",
        });
        if (onDone) await onDone();
        return resp.data;
      } catch (err: unknown) {
        const message = extractError(err);
        setError(message);
        throw err;
      } finally {
        setApproving(false);
      }
    },
    [onDone]
  );

  const declineRequest = useCallback(
    async (requestId: string, adminNote?: string) => {
      setError(null);
      setDeclining(true);
      try {
        const resp = await axios.patch(API.AD_ARTIST_VERIFICATION.DECLINE(requestId), {
          adminNote: adminNote ?? "",
        });
        if (onDone) await onDone();
        return resp.data;
      } catch (err: unknown) {
        const message = extractError(err);
        setError(message);
        throw err;
      } finally {
        setDeclining(false);
      }
    },
    [onDone]
  );

  return {
    approving,
    declining,
    error,
    approveRequest,
    declineRequest,
  } as const;
}

export default useAdminArtistVerificationActions;
