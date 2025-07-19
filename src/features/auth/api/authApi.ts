import { apiClient } from '@/lib/axios/client';
import { AUTH_ENDPOINTS } from '@/features/auth/api/endpoints';
import { LoginResponse } from '@/features/auth/types';

export const AuthApi = {
  login: (payload: {email: string, password: string}) => 
    apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, payload),
};