// API layer
// Call api from backend

import axios from "../axios";
import { API } from "../endpoints";

export const register = async ( registerData : any ) => {
    try{
        const response = await axios.post(
            API.AUTH.REGISTER, //path
            registerData //body data
        );
        return response.data; // what controller from backend sends
    } catch (err: Error | any) {
        throw new Error(
            // 400-500 err code counts as exception
            err.response?.data?.message // log error message from backend
             || err.message // default error message
             || "Registration failed" //fallback message if default fails
        );
    };
    

}
export const login = async ( loginData : any ) => {
    try{
        const response = await axios.post(
            API.AUTH.LOGIN, //path
            loginData //body data
        );
        return response.data; // what controller from backend sends
    } catch (err: Error | any) {
        throw new Error(
            // 400-500 err code counts as exception
            err.response?.data?.message // log error message from backend
             || err.message // default error message
             || "Login failed" //fallback message if default fails
        );
    };
   
}
 export const getProfile= async() =>{
        try{
            const response = await axios.get(
                API.AUTH.GETPROFILE, 
            );
            return response.data; 
        }catch (err: Error | any) {
            throw new Error(
                err.response?.data?.message 
                 || err.message 
                 || "Fetching profile failed" 
            );
        }
    }

export const updateProfile= async (updateData: any) => {
    try {
        const response=await axios.put(
            API.AUTH.UPDATEPROFILE,
            updateData,
            {
                headers:{
                    "Content-Type":'multipart/form-data'
                }
                    
            }
        )
        return response.data;
    }catch(err: Error | any){
        throw new Error(
            err.response?.data?.message 
            || err.message  
            || "Failed to update profile" 
        );
    }
}

export const requestPasswordReset = async (email: string) => {
    try {
        const response = await axios.post(API.AUTH.REQUEST_PASSWORD_RESET, { email });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Request password reset failed');
    }
};

export const resetPassword = async (token: string, newPassword: string) => {
    try {
        const response = await axios.post(API.AUTH.RESET_PASSWORD(token), { newPassword: newPassword });
        return response.data;
    } catch (error: Error | any) {
        throw new Error(error.response?.data?.message || error.message || 'Reset password failed');
    }
};