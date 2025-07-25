export const USERS_ENDPOINTS = {
    CREATE_USER: '/entities',
    LIST_USERS: '/entities',
    UPDATE_USER:'/entities/:id',
    DELETE_USER:'/entities/:id',
    REACTIVATE_USER:'/entities/:id/reactivate'
} as const;