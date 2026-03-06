// API layer for admin stats endpoints

import axios from "../../axios";
import { API } from "../../endpoints";

function handleApiError(err: any, defaultMessage: string): never {
  if (err.code === "ERR_NETWORK" || err.message === "Network Error" || !err.response) {
    throw new Error("Unable to connect to server. Please try again later.");
  }

  throw new Error(err.response?.data?.message || err.message || defaultMessage);
}

export const getOverallStats = async () => {
  try {
    const response = await axios.get(API.AD_STATS.OVERALL);
    return response.data;
  } catch (err: any) {
    handleApiError(err, "Failed to fetch overall stats");
  }
};

// Backwards-compatible alias (some builds may reference the alternate name)
export const getOverallSongStats = getOverallStats;
