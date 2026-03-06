// API layer for admin playlist favorites maintenance
// Call api from backend

import axios from "../../axios";
import { API } from "../../endpoints";

function handleApiError(err: any, defaultMessage: string): never {
  if (err.code === "ERR_NETWORK" || err.message === "Network Error" || !err.response) {
    throw new Error("Unable to connect to server. Please try again later.");
  }

  throw new Error(err.response?.data?.message || err.message || defaultMessage);
}

// Clean orphaned favorites (favorites for deleted playlists)
export const cleanOrphanedFavorites = async () => {
  try {
    const response = await axios.post(API.AD_USERS.CLEAN_ORPHANED_FAVORITES);
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to clean orphaned favorites");
  }
};
