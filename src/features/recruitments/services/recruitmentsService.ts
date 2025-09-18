import { apiClient } from "@/lib/axios/client";

export interface Recruitment {
  id: number;
  type: string;
  recruitmentType: string;
  state: string;
  status: string;
  description: string;
  date: string;
  options: string;
  progress: number;
  entityId: number;
  createdAt: string;
  updatedAt: string;
  entity?: {
    id: number;
    businessName?: string;
    firstName?: string;
    paternalSurname?: string;
    maternalSurname?: string;
  };
}

export interface RecruitmentsResponse {
  recruitments: Recruitment[];
  total: number;
  page: number;
  limit: number;
}

export class RecruitmentsService {
  /**
   * Obtiene todos los reclutamientos
   */
  static async getAllRecruitments(statusFilter?: string): Promise<RecruitmentsResponse> {
    try {
      const params = new URLSearchParams();
      if (statusFilter) {
        params.append('status', statusFilter);
      }
      
      const response = await apiClient.get(`/recruitments?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recruitments:', error);
      // Retornar datos mock mientras no esté implementado el backend
      return {
        recruitments: [],
        total: 0,
        page: 1,
        limit: 10
      };
    }
  }

  /**
   * Obtiene reclutamientos por ID de entidad
   */
  static async getRecruitmentsByEntityId(entityId: number): Promise<RecruitmentsResponse> {
    try {
      const response = await apiClient.get(`/recruitments/entity/${entityId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recruitments by entity:', error);
      // Retornar datos mock mientras no esté implementado el backend
      return {
        recruitments: [],
        total: 0,
        page: 1,
        limit: 10
      };
    }
  }

  /**
   * Obtiene un reclutamiento por ID
   */
  static async getRecruitmentById(id: number): Promise<{ data: any }> {
    try {
      const response = await apiClient.get(`/recruitments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recruitment by id:', error);
      throw error;
    }
  }

  /**
   * Crea un nuevo reclutamiento
   */
  static async createRecruitment(recruitmentData: Partial<Recruitment>): Promise<Recruitment> {
    try {
      const response = await apiClient.post('/recruitments', recruitmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating recruitment:', error);
      throw error;
    }
  }

  /**
   * Crea un reclutamiento con profileUp
   */
  static async createRecruitmentWithProfile(data: { type: string; profileUp: any }): Promise<any> {
    try {
      const response = await apiClient.post('/recruitments', data);
      return response.data;
    } catch (error) {
      console.error('Error creating recruitment with profile:', error);
      throw error;
    }
  }

  /**
   * Actualiza un reclutamiento
   */
  static async updateRecruitment(id: number, recruitmentData: Partial<Recruitment>): Promise<Recruitment> {
    try {
      const response = await apiClient.put(`/recruitments/${id}`, recruitmentData);
      return response.data;
    } catch (error) {
      console.error('Error updating recruitment:', error);
      throw error;
    }
  }

  /**
   * Elimina un reclutamiento por ID
   */
  static async deleteRecruitment(id: number): Promise<void> {
    try {
      await apiClient.delete(`/recruitments/${id}`);
    } catch (error) {
      console.error('Error deleting recruitment:', error);
      throw error;
    }
  }
}