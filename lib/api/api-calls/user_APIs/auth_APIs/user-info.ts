// API layer for user info management
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

// Add user info
export const addUserInfo = async (userInfoData: any) => {
    try {
        const response = await axios.post(API.USER_INFO.ADD_INFO, userInfoData);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to add user info");
    }
};

// Get user info
export const getUserInfo = async () => {
    try {
        const response = await axios.get(API.USER_INFO.GET_INFO);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch user info");
    }
};

// Clear user info
export const clearUserInfo = async () => {
    try {
        const response = await axios.delete(API.USER_INFO.CLEAR_INFO);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to clear user info");
    }
};
