import { UsersApi } from "../api/usersApi";
import { UsersListResponse } from "@/features/users/types/UserListResponse";
import { UserResponse, UserProps } from "@/features/users/types/UserListResponse";

/**
 * Type guard to check if error has response property
 */
function isAxiosError(error: unknown): error is { response: { status: number } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export const UsersService = {
  async createUser(payload: UserProps): Promise<UserResponse> {
    try {
      const { data } = await UsersApi.createUser(payload);
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Error creating user");
    }
  },

  async updateUser(id: number, payload: UserProps): Promise<UserResponse> {
    try {
      const { data } = await UsersApi.updateUser(id, payload);
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Error updating user");
    }
  },

  async getUsers(): Promise<UsersListResponse[]> {
    try {
      const { data } = await UsersApi.getUsers();
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Error getting users");
    }
  },

  async getUser(id: number): Promise<UsersListResponse> {
    try {
      const { data } = await UsersApi.getUser(id);
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Error getting user");
    }
  },

  async deleteUser(id: number): Promise<void> {
    try {
      await UsersApi.deleteUser(id);
    } catch (error: unknown) {
       if (isAxiosError(error) && error.response?.status === 401) {
         throw new Error("Unauthorized");
       }
       throw new Error("Error deleting user");
     }
  },

  async reactivateUser(id: number): Promise<void> {
    try {
      await UsersApi.reactivateUser(id);
    } catch (error: unknown) {
       if (isAxiosError(error) && error.response?.status === 401) {
         throw new Error("Unauthorized");
       }
       throw new Error("Error reactivating user");
     }
  },

  async addUserToJuridica(id: number, payload: { email: string, username: string }): Promise<void> {
    try {
      await UsersApi.addUserToJuridica(id, payload);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Error adding user to juridica");
    }
  },

  async updateStatusUser(id: number): Promise<void> {
    try {
      await UsersApi.updateStatusUser(id);
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Error updating status user");
    }
  },

};
