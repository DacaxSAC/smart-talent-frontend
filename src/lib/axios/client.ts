import axios from 'axios';
import { setupInterceptors } from './interceptors';

/**
 * URL base de la API desde variables de entorno
 * Fallback a localhost para desarrollo si no está definida
 */
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Cliente de Axios configurado para la aplicación
 */
export const apiClient = axios.create({
  baseURL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Configurar interceptores
setupInterceptors(apiClient);