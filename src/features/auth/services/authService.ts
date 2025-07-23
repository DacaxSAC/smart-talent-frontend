import { AuthApi } from '@/features/auth/api/authApi';
import { LoginResponse } from '@/features/auth/types';
import { AxiosError } from 'axios';

/**
 * Servicio de autenticación que maneja las operaciones de login
 */
export const AuthService = {
  /**
   * Realiza el login del usuario
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Promise con la respuesta del login
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await AuthApi.login({ email, password });
      return response.data;
    } catch (error) {
      // Manejo específico de errores de Axios
      if (error instanceof AxiosError) {
        // Error de autenticación (401)
        if (error.response?.status === 401) {
          return {
            success: false,
            message: 'Credenciales inválidas',
          };
        }
        
        // Error de validación (400)
        if (error.response?.status === 400) {
          return {
            success: false,
            message: error.response.data?.message || 'Datos inválidos',
          };
        }
        
        // Error de servidor (500+)
        if (error.response?.status && error.response.status >= 500) {
          return {
            success: false,
            message: 'Error interno del servidor',
          };
        }
        
        // Error de red o timeout
        if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
          return {
            success: false,
            message: 'Error de conexión. Verifica tu conexión a internet.',
          };
        }
      }
      
      // Error genérico
      return {
        success: false,
        message: 'Error inesperado. Intenta nuevamente.',
      };
    }
  },

  async requestPasswordReset(email: string): Promise<{ message: string}> {
    try {
      const response =  await AuthApi.requestPasswordReset(email);
      return response.data;
    } catch (error) {
      // Manejo específico de errores de Axios
      if (error instanceof AxiosError) {
        // Error de servidor (500+)
        return {
          message: 'Error interno del servidor',
        };
      }
      // Error genérico
      return {
        message: 'Error inesperado. Intenta nuevamente.',
      };
    }
  },

};
