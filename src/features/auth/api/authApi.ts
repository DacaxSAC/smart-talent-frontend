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

  /**
   * Solicita un reset de password
   * @param email - Email del usuario
   * @returns Promise con la respuesta del servidor
   */
  requestPasswordReset: (email: string): Promise<AxiosResponse<{message: string}>> => 
    apiClient.post<{message: string}>(AUTH_ENDPOINTS.REQUEST_PASSWORD_RESET, { email }),

  /**
   * Valida un token de reset de password
   * @param token - Token de reset de password
   * @returns Promise con la respuesta del servidor
   */
  validateResetToken: (token: string): Promise<AxiosResponse<{ valid: boolean, message: string }>> => 
    apiClient.get<{ valid: boolean, message: string }>(AUTH_ENDPOINTS.VALIDATE_RESET_TOKEN.replace(':token', token)),

  /**
   * Resetea el password
   * @param payload - Datos de reset de password
   * @returns Promise con la respuesta del servidor
   */
  resetPassword: (payload: {token: string, password: string}): Promise<AxiosResponse<void>> => 
    apiClient.post<void>(AUTH_ENDPOINTS.RESET_PASSWORD, payload),

};