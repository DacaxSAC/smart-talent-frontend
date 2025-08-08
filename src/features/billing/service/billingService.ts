import { billingApi } from "../api/billingApi";
import { filtersProps } from "../types/FilterProps";
import { RequestsHistoryResponse } from "../types/RequestsHistory";
import { RecruitmentsHistoryResponse } from "../types/RecruitmentsHistory";


/**
 * Type guard to check if error has response property
 */
function isAxiosError(error: unknown): error is { response: { status: number } } {
  return typeof error === 'object' && error !== null && 'response' in error;
}

export const BillingService = {
  async getRequestsHistory(payload: filtersProps): Promise<RequestsHistoryResponse> {
    try {
      const { data } = await billingApi.getRequestsHistory(payload);
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Error fetching requests history");
    }
  },
  async getRecruitmentsHistory(payload: filtersProps): Promise<RecruitmentsHistoryResponse> {
    try {
      const { data } = await billingApi.getRecruitmentsHistory(payload);
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response?.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Error fetching recruitments history");
    }
  },
};
