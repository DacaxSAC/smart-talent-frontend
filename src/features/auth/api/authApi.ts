import { apiClient } from '@/lib/axios/client';
import { AUTH_ENDPOINTS } from '@/features/auth/api/endpoints';
import { LoginResponse } from '@/features/auth/types';
import type { AxiosResponse } from 'axios';

/**
 * Tipos para las peticiones de autenticación
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * API de autenticación - Maneja todas las peticiones relacionadas con auth
 */
export const AuthApi = {
  /**
   * Realiza el login del usuario
   * @param payload - Datos de login (email y password)
   * @returns Promise con la respuesta del servidor
   */
  login: (payload: LoginPayload): Promise<AxiosResponse<LoginResponse>> => 
    apiClient.post<LoginResponse>(AUTH_ENDPOINTS.LOGIN, payload),
  
  /**
   * Realiza el logout del usuario
   * @returns Promise con la respuesta del servidor
   */
  logout: (): Promise<AxiosResponse<void>> => 
    apiClient.post<void>(AUTH_ENDPOINTS.LOGOUT),
};