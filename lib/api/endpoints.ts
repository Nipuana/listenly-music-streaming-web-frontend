// List of api routes
// Single source of truth for api endpoints

export const API = {
 AUTH:{
    REGISTER: 'api/auth/register',
    LOGIN: 'api/auth/login',
    GETPROFILE: 'api/auth/profile',
    UPDATEPROFILE:'api/auth/update-profile'
},

AD_USERS: {
    CREATE_USER: 'api/admin/create-user',
    GET_ALL_USERS: 'api/admin/get-all-users',
    GET_USER: 'api/admin/get-user',
    UPDATE_USER: 'api/admin/update-user',
    DELETE_USER: 'api/admin/delete-user'
}
};