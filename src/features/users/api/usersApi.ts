import { apiClient } from "@/lib/axios/client";
import { USERS_ENDPOINTS } from "./endpoints";

interface UserProps {
    documentNumber: string;
    firstName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
    businessName?: string;
    email: string;
    address: string;
    phone: string;
  }

export const UsersApi = {
    createUser: (payload: UserProps) => apiClient.post(USERS_ENDPOINTS.CREATE_USER, payload),
    getUsers:() => apiClient.get(USERS_ENDPOINTS.LIST_USERS),
    getUser:(id: number) => apiClient.get(USERS_ENDPOINTS.GET_USER.replace(':id',`${id}`)),
    updateUser: (id: number, payload: UserProps) => apiClient.put(USERS_ENDPOINTS.UPDATE_USER.replace(':id',`${id}`), payload),
    deleteUser: (id: number) => apiClient.delete(USERS_ENDPOINTS.DELETE_USER.replace(':id',`${id}`)),
    reactivateUser: (id: number) => apiClient.put(USERS_ENDPOINTS.REACTIVATE_USER.replace(':id',`${id}`)),
    addUserToJuridica: (id: number, payload: { email: string, username:string }) => apiClient.post(USERS_ENDPOINTS.ADD_USER_TO_JURIDICA.replace(':id',`${id}`), payload),
} as const;