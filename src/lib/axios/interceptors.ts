import type { AxiosInstance, AxiosError } from 'axios';

/**
 * Configura los interceptores de Axios para manejo de autenticación y errores
 * @param instance - Instancia de Axios a configurar
 */
export function setupInterceptors(instance: AxiosInstance) {
  // Interceptor de request - Agregar token de autenticación
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log de requests en desarrollo
      if (import.meta.env.DEV) {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Request error:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor de response - Manejo de errores globales
  instance.interceptors.response.use(
    (response) => {
      // Log de responses exitosas en desarrollo
      if (import.meta.env.DEV) {
        console.log(`✅ ${response.status} ${response.config.url}`);
      }
      return response;
    },
    (error: AxiosError) => {
      // Log de errores en desarrollo
      if (import.meta.env.DEV) {
        console.error(`❌ ${error.response?.status} ${error.config?.url}:`, error.response?.data);
      }
      
      // Manejo de errores de autenticación
      if (error.response?.status === 401) {
        // Limpiar token inválido
        localStorage.removeItem('auth_token');
        
        // Redirigir solo si no estamos ya en login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      
      return Promise.reject(error);
    }
  );
}