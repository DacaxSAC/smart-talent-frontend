import { apiClient } from "@/lib/axios/client";
import { BILLING_ENDPOINTS } from "./endpoints";
import { filtersProps } from "../types/FilterProps";


export const billingApi = {
    getRequestsHistory: (payload: filtersProps) => apiClient.post(BILLING_ENDPOINTS.LIST_REQUESTS_HISTORY, payload),
    getRecruitmentsHistory: (payload: filtersProps) => apiClient.post(BILLING_ENDPOINTS.LIST_RECRUITMENTS_HISTORY, payload),
} as const;