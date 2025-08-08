export interface RecruitmentsHistoryResponse {
    requests: RecruitmentsHistory[];
    total: number;
    page: number;
    limit: number;
}

export interface RecruitmentsHistory {
    id: number;
    entityId: number;   
    amount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}
