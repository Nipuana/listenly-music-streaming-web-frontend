// API layer for admin artist verification review
// Call api from backend

import axios from "../../axios";
import { API } from "../../endpoints";

function handleApiError(err: any, defaultMessage: string): never {
  if (err.code === "ERR_NETWORK" || err.message === "Network Error" || !err.response) {
    throw new Error("Unable to connect to server. Please try again later.");
  }

  throw new Error(err.response?.data?.message || err.message || defaultMessage);
}

export type ArtistVerificationRequestStatus = "pending" | "approved" | "declined";

// List verification requests (optionally filtered by status)
export const listArtistVerificationRequests = async (status?: ArtistVerificationRequestStatus) => {
  try {
    const response = await axios.get(API.AD_ARTIST_VERIFICATION.LIST(status));
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to fetch artist verification requests");
  }
};

export const approveArtistVerificationRequest = async (requestId: string, payload?: unknown) => {
  try {
    const response = await axios.patch(API.AD_ARTIST_VERIFICATION.APPROVE(requestId), payload ?? {});
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to approve artist verification request");
  }
};

export const declineArtistVerificationRequest = async (requestId: string, payload?: unknown) => {
  try {
    const response = await axios.patch(API.AD_ARTIST_VERIFICATION.DECLINE(requestId), payload ?? {});
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to decline artist verification request");
  }
};
