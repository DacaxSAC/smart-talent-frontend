export const DOCUMENT_TYPE_ENDPOINTS = {
    GET_ALL_WITH_RESOURCE_TYPES: '/document-types/with-resource-types',
} as const;

export const REQUEST_ENDPOINTS = {
    GET_REQUEST_PEOPLE: '/requests/people',
    GET_REQUEST_PEOPLE_BY_ENTITY_ID: (entityId: number) => `/requests/entity/${entityId}/people`,
    GET_REQUEST_DETAIL: (requestId: number) => `/requests/person/${requestId}`,
    UPDATE_DOCUMENTS: '/documents/bulk-update',
    POST_REQUESTS: '/requests',
    DELETE_REQUEST: (requestId: number) => `/requests/${requestId}`,
    POST_ASSIGN_RECRUITER: '/requests/assign-recruiter',
    POST_OBSERVATIONS: '/requests/give-observations',
    PATCH_RESOURCES_UPDATE_MULTIPLE:'/resources/update-multiple',
    PUT_STATUS_PERSON: '/requests/person/update-status',
} as const;