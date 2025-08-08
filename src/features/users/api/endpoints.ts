export const USERS_ENDPOINTS = {
    CREATE_USER: '/entities',
    LIST_USERS: '/entities',
    GET_USER:'/entities/:id',
    UPDATE_USER:'/entities/:id',
    DELETE_USER:'/entities/:id',
    REACTIVATE_USER:'/entities/:id/reactivate',
    ADD_USER_TO_JURIDICA:'/entities/:id/users',
    UPDATE_STATUS_USER:'/users/:id/toggle-status'
} as const;