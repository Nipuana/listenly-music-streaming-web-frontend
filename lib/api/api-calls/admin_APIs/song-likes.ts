// API layer for admin song likes maintenance
// Call api from backend

import axios from "../../axios";
import { API } from "../../endpoints";

// Helper function to handle API errors
function handleApiError(err: any, defaultMessage: string): never {
  if (err.code === "ERR_NETWORK" || err.message === "Network Error" || !err.response) {
    throw new Error("Unable to connect to server. Please try again later.");
  }

  throw new Error(
    err.response?.data?.message || err.message || defaultMessage
  );
}

// Clean orphaned likes (likes for deleted songs)
export const cleanOrphanedLikes = async () => {
  try {
    const response = await axios.post(API.AD_USERS.CLEAN_ORPHANED_LIKES);
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to clean orphaned likes");
  }
};
