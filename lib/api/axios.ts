import axios from 'axios';
import { config } from 'zod/v4/core';
import { getAuthToken } from '../cookies/user-data-cookie';

const Base_URL = process.env.Next_Public_API_BASE_URL
|| 'http://localhost:5000';

const AxiosInstance = axios.create({
  baseURL: Base_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

AxiosInstance.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();
        if(token && config.headers){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export default AxiosInstance;