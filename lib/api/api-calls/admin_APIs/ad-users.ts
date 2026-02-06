// API layer for admin user management
// Call api from backend

import axios from "../../axios";
import { API } from "../../endpoints";

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

// Get all users
export const getAllUsers = async () => {
    try {
        const response = await axios.get(API.AD_USERS.GET_ALL_USERS);
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch users");
    }
};

// Get user by id
export const getUserById = async (id: string) => {
    try {
        const response = await axios.get(API.AD_USERS.GET_USER(id));
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to fetch user");
    }
};

// Create user
export const createUser = async (userData: any) => {
    try {
        const response = await axios.post(
            API.AD_USERS.CREATE_USER,
            userData
        );
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to create user");
    }
};

// Update user
export const updateUser = async (id: string, userData: any) => {
    try {
        const response = await axios.put(
            API.AD_USERS.UPDATE_USER(id),
            userData
        );
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to update user");
    }
};

// Delete user
export const deleteUser = async (id: string) => {
    try {
        const response = await axios.delete(
            API.AD_USERS.DELETE_USER(id)
        );
        return response.data;
    } catch (err: any) {
        handleApiError(err, "Failed to delete user");
    }
};
