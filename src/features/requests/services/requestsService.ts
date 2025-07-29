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
            allowedFileTypes?: string[];
        }[]
    }[];
    Users: {
        id: number;
        username: string;
        email:string;
        Roles: {
            name: string;
        }[];
    }[];
}

export interface GetPersonResponse {
    message: string;
    person: Request;
}


export interface GetAllPeopleResponse {
    message: string;
    people: Request[];
}

export interface PostRequestsResponse {
    status: number;
}

export interface PersonRequest {
    dni: string;
    fullname: string;
    phone: string;
    documents: {
        id: number;
        resources: {
            id: number;
            value: string;
        }[];
    }[];
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
    getRequestDetail: async (requestId: number): Promise<GetPersonResponse> => {
        try {
            const response = await apiClient.get(REQUEST_ENDPOINTS.GET_REQUEST_DETAIL(requestId));
            return response.data;
        } catch (error) {
            console.error('Error al obtener los detalles de la solicitud:', error);
            throw error;
        }
    },
    postRequest: async ({ entityId, people } : { entityId: number, people: PersonRequest[] }): Promise<PostRequestsResponse> => {
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

    sendCorrections: async (resources: Array<{resourceId: number, value: string}>): Promise<void> => {
        try {
            await apiClient.patch(REQUEST_ENDPOINTS.PATCH_RESOURCES_UPDATE_MULTIPLE, { 
                resources 
            });
        } catch (error) {
            console.error('Error al enviar las correcciones:', error);
            throw error;
        }
    },

    putStatusPerson: async (personId: number, status: string): Promise<void> => {
        try {
            await apiClient.patch(REQUEST_ENDPOINTS.PUT_STATUS_PERSON, { personId, status });
        } catch (error) {
            console.error('Error al actualizar el estado de la persona:', error);
            throw error;
        }
    }

};