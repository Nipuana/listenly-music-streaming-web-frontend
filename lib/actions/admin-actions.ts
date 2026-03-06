// Server side processing of admin actions
"use server";
import { revalidatePath } from "next/cache";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../api/api-calls/admin_APIs/ad-users";
import { cleanOrphanedLikes } from "../api/api-calls/admin_APIs/song-likes";
import { cleanOrphanedFavorites } from "../api/api-calls/admin_APIs/playlist-favorites";
import {
    approveArtistVerificationRequest,
    declineArtistVerificationRequest,
    listArtistVerificationRequests,
    type ArtistVerificationRequestStatus,
} from "../api/api-calls/admin_APIs/artist-verification";

// Get all users
export const handleGetAllUsers = async () => {
    try {
        const result = await getAllUsers();
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch users"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to fetch users"
        };
    }
};

// Get user by id
export const handleGetUserById = async (id: string) => {
    try {
        const result = await getUserById(id);
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch user"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to fetch user"
        };
    }
};

// Create user
export const handleCreateUser = async (formData: any) => {
    try {
        const result = await createUser(formData);
        if (result.success) {
            revalidatePath("/admin/ad-dash");
            return {
                success: true,
                message: "User created successfully",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to create user"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to create user"
        };
    }
};

// Update user
export const handleUpdateUser = async (id: string, formData: any) => {
    try {
        const result = await updateUser(id, formData);
        if (result.success) {
            revalidatePath("/admin/ad-dash");
            return {
                success: true,
                message: "User updated successfully",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to update user"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to update user"
        };
    }
};

// Delete user
export const handleDeleteUser = async (id: string) => {
    try {
        const result = await deleteUser(id);
        if (result.success) {
            revalidatePath("/admin/ad-dash");
            return {
                success: true,
                message: "User deleted successfully"
            };
        }
        return {
            success: false,
            message: result.message || "Failed to delete user"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to delete user"
        };
    }
};

// Clean orphaned likes
export const handleCleanOrphanedLikes = async () => {
    try {
        const result = await cleanOrphanedLikes();
        if (result.success) {
            return {
                success: true,
                message: result.message || "Orphaned likes cleaned successfully",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to clean orphaned likes"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to clean orphaned likes"
        };
    }
};

// Clean orphaned favorites
export const handleCleanOrphanedFavorites = async () => {
    try {
        const result = await cleanOrphanedFavorites();
        if (result.success) {
            return {
                success: true,
                message: result.message || "Orphaned favorites cleaned successfully",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to clean orphaned favorites"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to clean orphaned favorites"
        };
    }
};

// Artist verification (admin)
export const handleListArtistVerificationRequests = async (status?: ArtistVerificationRequestStatus) => {
    try {
        const result = await listArtistVerificationRequests(status);
        if (result.success) {
            return {
                success: true,
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to fetch artist verification requests"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to fetch artist verification requests"
        };
    }
};

export const handleApproveArtistVerificationRequest = async (requestId: string) => {
    try {
        const result = await approveArtistVerificationRequest(requestId);
        if (result.success) {
            revalidatePath("/admin/ad-dash");
            return {
                success: true,
                message: result.message || "Artist verification request approved",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to approve artist verification request"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to approve artist verification request"
        };
    }
};

export const handleDeclineArtistVerificationRequest = async (requestId: string) => {
    try {
        const result = await declineArtistVerificationRequest(requestId);
        if (result.success) {
            revalidatePath("/admin/ad-dash");
            return {
                success: true,
                message: result.message || "Artist verification request declined",
                data: result.data
            };
        }
        return {
            success: false,
            message: result.message || "Failed to decline artist verification request"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to decline artist verification request"
        };
    }
};
