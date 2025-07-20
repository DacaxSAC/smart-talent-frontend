import { AuthApi } from '@/features/auth/api/authApi';
import { LoginResponse } from '@/features/auth/types';

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse | null> {
    try {
      const { data } = await AuthApi.login({ email, password });
      console.log(data);
      return data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        return null;
      }
      throw new Error("Error en el servidor");
    }
  },
};
