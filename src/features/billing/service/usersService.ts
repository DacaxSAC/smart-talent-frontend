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
};
