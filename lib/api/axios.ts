import axios from 'axios';

const Base_URL = process.env.Next_Public_API_BASE_URL
|| 'http://localhost:5000';

const AxiosInstance = axios.create({
  baseURL: Base_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default AxiosInstance;