import axios from 'axios';

const Base_URL = process.env.API_BASE_URL 
|| 'http://localhost:5050';

const AxiosInstance = axios.create({
  baseURL: Base_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function getAuthToken() {
  // Simulate an async operation to get the auth token
  return 'your-auth-token';
}

export default AxiosInstance;