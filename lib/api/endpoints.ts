// List of api routes
// Single source of truth for api endpoints

export const API = {
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    GET_PROFILE: '/api/auth/profile',
    UPDATE_PROFILE: '/api/auth/update-profile',
    REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
    RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
  },

  AD_USERS: {
    CREATE_USER: '/api/admin/create-user',
    GET_ALL_USERS: '/api/admin/get-all-users',
    GET_USER: (id: string) => `/api/admin/get-user/${id}`,
    UPDATE_USER: (id: string) => `/api/admin/update-user/${id}`,
    DELETE_USER: (id: string) => `/api/admin/delete-user/${id}`,
  },

  USER_INFO: {
    ADD_INFO: '/api/userInfo/add-info',
    GET_INFO: '/api/userInfo/get-info',
    CLEAR_INFO: '/api/userInfo/clear-info',
  },

  
};