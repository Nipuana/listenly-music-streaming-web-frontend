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
    CLEAN_ORPHANED_LIKES: '/api/admin/clean-orphaned-likes',
    CLEAN_ORPHANED_FAVORITES: '/api/admin/clean-orphaned-favorites',
    
  },

  USER_INFO: {
    ADD_INFO: '/api/userInfo/add-info',
    GET_INFO: '/api/userInfo/get-info',
    CLEAR_INFO: '/api/userInfo/clear-info',
  },

  SONGS: {
    GET_ALL: '/api/songs/get-all-songs',
    GET_MY_SONGS: '/api/songs/my-songs',
    GET_BY_USER: (userId: string) => `/api/songs/getSongByuserId/${userId}`,
    GET_BY_GENRE: (genre: string) => `/api/songs/getSongsBygenre/${genre}`,
    GET_BY_ID: (id: string) => `/api/songs/getSongById/${id}`,
    PLAY_COUNT: (id: string) => `/api/songs/play-count/${id}`,
    LISTEN_TIME: (id: string) => `/api/songs/listen-time/${id}`,
    CREATE: '/api/songs/create-song',
    UPDATE: (id: string) => `/api/songs/update-song/${id}`,
    DELETE: (id: string) => `/api/songs/del-song/${id}`,
  },

  SONG_LIKES: {
    GET_LIKED: '/api/songs/user/liked-songs',
    LIKE_STATUS: (id: string) => `/api/songs/like-status/${id}/liked`,
    TOGGLE_LIKE: (id: string) => `/api/songs/change-like-status/${id}`,
  },

  PLAYLISTS: {
    GET_ALL: '/api/playlists/get-all',
    GET_MY: '/api/playlists/user/my-playlists',
    GET_BY_ID: (id: string) => `/api/playlists/getPlaylistById/${id}`,
    CREATE: '/api/playlists/create-playlist',
    UPDATE: (id: string) => `/api/playlists/update-playlist/${id}`,
    DELETE: (id: string) => `/api/playlists/delete-playlist/${id}`,
    ADD_SONG: (id: string) => `/api/playlists/${id}/songs`,
    REMOVE_SONG: (id: string, songId: string) => `/api/playlists/remove-song-from-playlist/${id}/${songId}`,
    REORDER_SONGS: (id: string) => `/api/playlists//reorder-songs/${id}`,
  },    

  PLAYLIST_FAVORITES: {
    GET_FAVORITED: '/api/playlists/user/favorited',
    FAVORITE_STATUS: (id: string) => `/api/playlists/${id}/favorited`,
    TOGGLE_FAVORITE: (id: string) => `/api/playlists/${id}/favorite`,
  },
  
  ARTIST_VERIFICATION: {
  SUBMIT: '/api/artist-verification/request',
  MY_LATEST: '/api/artist-verification/my-request',
},

AD_ARTIST_VERIFICATION: {
  LIST: (status?: 'pending' | 'approved' | 'declined') =>
    status
      ? `/api/admin/artist-verification/requests?status=${status}`
      : '/api/admin/artist-verification/requests',
  APPROVE: (id: string) => `/api/admin/artist-verification/requests/${id}/approve`,
  DECLINE: (id: string) => `/api/admin/artist-verification/requests/${id}/decline`,
},
AD_AUDIT_LOGS: {
  // list with optional query params: { limit, page, adminId, action }
  LIST: (params?: Record<string, string | number>) =>
    params && Object.keys(params).length
      ? `/api/admin/audit-logs?${new URLSearchParams(params as Record<string, string>).toString()}`
      : '/api/admin/audit-logs',

  GET_BY_ID: (id: string) => `/api/admin/audit-logs/${id}`,
},
  AD_STATS: {
    OVERALL: '/api/admin/stats/overall',
  },
};