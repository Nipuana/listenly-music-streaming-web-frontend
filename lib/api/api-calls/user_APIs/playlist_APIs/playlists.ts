// API layer for playlists management
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

// Get all playlists
export const getAllPlaylists = async () => {
    try {
        const response = await axios.get(API.PLAYLISTS.GET_ALL);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch playlists");
    }
};

// Get my playlists
export const getMyPlaylists = async () => {
    try {
        const response = await axios.get(API.PLAYLISTS.GET_MY);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch your playlists");
    }
};

// Get playlist by ID
export const getPlaylistById = async (id: string) => {
    try {
        const response = await axios.get(API.PLAYLISTS.GET_BY_ID(id));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch playlist");
    }
};

// Create playlist
export const createPlaylist = async (playlistData: any) => {
    try {
        const response = await axios.post(API.PLAYLISTS.CREATE, playlistData);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to create playlist");
    }
};

// Update playlist
export const updatePlaylist = async (id: string, playlistData: any) => {
    try {
        const response = await axios.put(API.PLAYLISTS.UPDATE(id), playlistData);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to update playlist");
    }
};

// Delete playlist
export const deletePlaylist = async (id: string) => {
    try {
        const response = await axios.delete(API.PLAYLISTS.DELETE(id));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to delete playlist");
    }
};

// Add song to playlist
export const addSongToPlaylist = async (id: string, songId: string) => {
    try {
        const response = await axios.post(API.PLAYLISTS.ADD_SONG(id), { songId });
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to add song to playlist");
    }
};

// Remove song from playlist
export const removeSongFromPlaylist = async (id: string, songId: string) => {
    try {
        const response = await axios.delete(API.PLAYLISTS.REMOVE_SONG(id, songId));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to remove song from playlist");
    }
};

// Reorder songs in playlist
export const reorderPlaylistSongs = async (id: string, songIds: string[]) => {
    try {
        const response = await axios.put(API.PLAYLISTS.REORDER_SONGS(id), { songIds });
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to reorder playlist songs");
    }
};
