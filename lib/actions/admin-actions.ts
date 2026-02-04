// Server side processing of admin actions
"use server";
import { revalidatePath } from "next/cache";
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../api/api-calls/admin_APIs/ad-users";

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
