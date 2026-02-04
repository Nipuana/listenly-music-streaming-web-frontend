// server side processing of both actions
"use server";
import { revalidatePath } from "next/cache";
import { login, register,getProfile, updateProfile, requestPasswordReset, resetPassword } from "../api/api-calls/auth";
import { setUserData } from "../cookie";
import { success } from "zod";

export const handleRegister = async (formData: any) => {
    try{
        //how to get data from component
        const result=await register(formData);
        // how to send back to component
        if(result.success){
            return {
                success: true,
                message: "Registration successful",
                data: result.data
                };
        }
        return {
            success: false,
            message: result.message || "Registration failed"
        };
    }catch(err: Error | any){
        return {
            success: false,
            message: err.message || "Registration failed"
        };
    }

}
export const handleLogin = async (formData: any) => {
    try{
        //how to get data from component
        const result=await login(formData);
        // how to send back to component
        if(result.success){
            return {
                success: true,
                message: "Login successful",
                data: result.data
                };
        }
        return {
            success: false,
            message: result.message || "Login failed"
        };
    }catch(err: Error | any){
        return {
            success: false,
            message: err.message || "Login failed"
        };
    }

}

export const handleGetProfile= async()=>{
    try{
        const result= await getProfile();
        if(result.success){
            return {
                success:true,
                data: result.data
            };
        }
        return {
            success:false,
            message: result.message || "Fetching profile failed"
        };
    }catch(err: Error | any){
        return {
            success:false,
            message: err.message || "Fetching profile failed"
        };
    }
}

export const handleUpdateData= async (formData: any) => {
    try{
        const result = await updateProfile(formData);
        if (result.success){
            //update cookie
            await setUserData(result.data)

            revalidatePath("/user/profile")
        
        return{
            success:true,
            message: "Profile updated successfully",
            data: result.data
        };
    }
     return {
            success:false,
            message: result.message || "Updating profile failed"
        };
    }catch(err: Error | any){
        return {
            success:false,
            message: err.message || "Updating profile failed"
        };
    }
}

export const handleRequestPasswordReset = async (email: string) => {
    try {
        const result = await requestPasswordReset(email);
        if (result.success) {
            return {
                success: true,
                message: "Password reset link sent successfully",
            };
        }
        return {
            success: false,
            message: result.message || "Failed to send reset link"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to send reset link"
        };
    }
}

export const handleResetPassword = async (token: string, newPassword: string) => {
    try {
        const result = await resetPassword(token, newPassword);
        if (result.success) {
            return {
                success: true,
                message: "Password reset successfully",
            };
        }
        return {
            success: false,
            message: result.message || "Failed to reset password"
        };
    } catch (err: Error | any) {
        return {
            success: false,
            message: err.message || "Failed to reset password"
        };
    }
}