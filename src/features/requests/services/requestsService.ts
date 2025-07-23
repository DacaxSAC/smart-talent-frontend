import { apiClient } from '@/lib/axios/client';
import { REQUEST_ENDPOINTS } from '../api/endpoints';

export interface Request {
    id: string;
    owner?: string;
    dni: string;
    fullname: string;
    status: string;
    phone: string;
    observations:string;
    documents: {
        id: number;
        name: string;
        filename: File | string | null;
        result: string | null;
        status: string;
        resources: {
            id: number;
            name: string;
            value: string;
        }[]
    }[];
}

export interface GetAllPeopleResponse {
    message: string;
    people: Request[];
}

export interface PostRequestsResponse {
    status: number;
}

export const RequestsService = {
    /**
     * Obtiene todas las personas/solicitudes con filtros de estado opcionales
     * @param status - Estados a filtrar separados por coma (ej: 'PENDING,IN_PROGRESS')
     */
    getAllPeople: async (status?: string): Promise<GetAllPeopleResponse> => {
        try {
            const url = status 
                ? `${REQUEST_ENDPOINTS.GET_REQUEST_PEOPLE}?status=${status}`
                : REQUEST_ENDPOINTS.GET_REQUEST_PEOPLE;
            const response = await apiClient.get(url);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las solicitudes:', error);
            throw error;
        }
    },
    getAllPeopleByEntityId: async (entityId: number): Promise<GetAllPeopleResponse> => {
        try {
            const response = await apiClient.get(REQUEST_ENDPOINTS.GET_REQUEST_PEOPLE_BY_ENTITY_ID(entityId));
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error al obtener las solicitudes:', error);
            throw error;
        }
    },
    postRequest: async ({ entityId, people } : { entityId: number, people: any[] }): Promise<PostRequestsResponse> => {
        try {
            return apiClient.post(REQUEST_ENDPOINTS.POST_REQUESTS, { entityId, people });
        } catch (error) {
            console.error('Error al actualizar los informes:', error);
            throw error;
        }
    },
    updateDocuments: async (updates: { id: number; result: string; filename: string }[]): Promise<void> => {
        try {
            await apiClient.put(REQUEST_ENDPOINTS.UPDATE_DOCUMENTS, { updates });
        } catch (error) {
            console.error('Error al actualizar los informes:', error);
            throw error;
        }
    },
    assignRecruiter: async (personId: number, recruiterId: number): Promise<void> => {
        try {
            await apiClient.patch(REQUEST_ENDPOINTS.POST_ASSIGN_RECRUITER, { personId, recruiterId });
        } catch (error) {
            console.error('Error al asignar el reclutador:', error);
            throw error;
        }
    },
    postObservations: async (personId: number, observations: string): Promise<void> => {
        try {
            await apiClient.patch(REQUEST_ENDPOINTS.POST_OBSERVATIONS, { personId, observations });
        } catch (error) {
            console.error('Error al agregar las observaciones:', error);
            throw error;
        }
    },

};