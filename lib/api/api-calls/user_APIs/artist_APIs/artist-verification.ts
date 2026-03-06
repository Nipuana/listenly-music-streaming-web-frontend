// API layer for artist verification (user)
// Call api from backend

import axios from "../../../axios";
import { API } from "../../../endpoints";

function handleApiError(err: any, defaultMessage: string): never {
  if (err.code === "ERR_NETWORK" || err.message === "Network Error" || !err.response) {
    throw new Error("Unable to connect to server. Please try again later.");
  }

  throw new Error(err.response?.data?.message || err.message || defaultMessage);
}

export type ArtistVerificationStatus = "pending" | "approved" | "declined";

export interface SubmitArtistVerificationRequest {
  // Keep flexible: backend can evolve without breaking the FE.
  [key: string]: unknown;
}

// Submit a verification request (current user)
export const submitArtistVerification = async (payload: SubmitArtistVerificationRequest) => {
  try {
    const response = await axios.post(API.ARTIST_VERIFICATION.SUBMIT, payload);
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to submit artist verification request");
  }
};

// Fetch the latest verification request for the current user
export const getMyLatestArtistVerificationRequest = async () => {
  try {
    const response = await axios.get(API.ARTIST_VERIFICATION.MY_LATEST);
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to fetch artist verification request");
  }
};
