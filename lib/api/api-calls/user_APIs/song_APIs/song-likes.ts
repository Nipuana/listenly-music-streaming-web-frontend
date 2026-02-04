// API layer for song likes management
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

// Get liked songs
export const getLikedSongs = async () => {
    try {
        const response = await axios.get(API.SONG_LIKES.GET_LIKED);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch liked songs");
    }
};

// Get like status for a song
export const getLikeStatus = async (id: string) => {
    try {
        const response = await axios.get(API.SONG_LIKES.LIKE_STATUS(id));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch like status");
    }
};

// Toggle like status for a song
export const toggleLike = async (id: string) => {
    try {
        const response = await axios.post(API.SONG_LIKES.TOGGLE_LIKE(id));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to toggle like status");
    }
};
