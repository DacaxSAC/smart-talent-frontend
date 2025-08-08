export interface RequestsHistoryResponse {
    success: boolean;
    message: string;
    data: {
        requests: RequestsHistory[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalItems: number;
            itemsPerPage: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    };
}

export interface RequestsHistory {
    id: number;
    date: string;
    owner: string;
    dni: string;
    fullname: string;
    status: string;
    documents: {
        name: string;
        status: string;
    }[];
}
