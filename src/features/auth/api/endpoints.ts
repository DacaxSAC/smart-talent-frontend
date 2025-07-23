/**
 * Endpoints de autenticación
 */
export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REQUEST_PASSWORD_RESET:'/auth/request-password-reset',
    VALIDATE_RESET_TOKEN:'/auth/validate-reset-token/:token',
    RESET_PASSWORD:'/auth/reset-password',
} as const;