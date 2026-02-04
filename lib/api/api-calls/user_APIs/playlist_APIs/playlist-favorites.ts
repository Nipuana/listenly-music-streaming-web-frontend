// API layer for playlist favorites management
// Call api from backend

import axios from "../../../axios";
import { API } from "../../../endpoints";

// Helper function to handle API errors
function handleApiError(err: any, defaultMessage: string): never {
    // Check if backend is not running (network error)
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error' || !err.response) {
        throw new Error("Unable to connect to server. Please try again later.");
    }
    
    // Backend returned an error response
    throw new Error(
        err.response?.data?.message 
        || err.message 
        || defaultMessage
    );
}

// Get favorited playlists
export const getFavoritedPlaylists = async () => {
    try {
        const response = await axios.get(API.PLAYLIST_FAVORITES.GET_FAVORITED);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch favorited playlists");
    }
};

// Get favorite status for a playlist
export const getFavoriteStatus = async (id: string) => {
    try {
        const response = await axios.get(API.PLAYLIST_FAVORITES.FAVORITE_STATUS(id));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch favorite status");
    }
};

// Toggle favorite status for a playlist
export const toggleFavorite = async (id: string) => {
    try {
        const response = await axios.post(API.PLAYLIST_FAVORITES.TOGGLE_FAVORITE(id));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to toggle favorite status");
    }
};
