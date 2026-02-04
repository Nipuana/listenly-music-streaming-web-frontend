// API layer for songs management
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

// Get all songs
export const getAllSongs = async () => {
    try {
        const response = await axios.get(API.SONGS.GET_ALL);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch songs");
    }
};

// Get my songs
export const getMySongs = async () => {
    try {
        const response = await axios.get(API.SONGS.GET_MY_SONGS);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch your songs");
    }
};

// Get songs by user ID
export const getSongsByUser = async (userId: string) => {
    try {
        const response = await axios.get(API.SONGS.GET_BY_USER(userId));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch user songs");
    }
};

// Get songs by genre
export const getSongsByGenre = async (genre: string) => {
    try {
        const response = await axios.get(API.SONGS.GET_BY_GENRE(genre));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch songs by genre");
    }
};

// Get song by ID
export const getSongById = async (id: string) => {
    try {
        const response = await axios.get(API.SONGS.GET_BY_ID(id));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch song");
    }
};

// Update play count
export const updatePlayCount = async (id: string) => {
    try {
        const response = await axios.post(API.SONGS.PLAY_COUNT(id));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to update play count");
    }
};

// Update listen time
export const updateListenTime = async (id: string, listenTime: number) => {
    try {
        const response = await axios.post(API.SONGS.LISTEN_TIME(id), { listenTime });
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to update listen time");
    }
};

// Create song
export const createSong = async (songData: any) => {
    try {
        const response = await axios.post(API.SONGS.CREATE, songData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to create song");
    }
};

// Update song
export const updateSong = async (id: string, songData: any) => {
    try {
        const response = await axios.put(API.SONGS.UPDATE(id), songData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to update song");
    }
};

// Delete song
export const deleteSong = async (id: string) => {
    try {
        const response = await axios.delete(API.SONGS.DELETE(id));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to delete song");
    }
};
