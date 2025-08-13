import { IResourceType } from "../interfaces/IDocumentTypeResponse";

export type RequestsType = {
    isConfirmed: boolean;
    dni: string;
    fullname: string;
    phone: string;
    documents: {
      name: string;
      state: boolean;
      isHeader: boolean;
      documentTypeId: number;
      documentTypeName: string;
      resourceTypes: IResourceType[];
      resources: {
        resourceTypeId: number;
        name: string;
        value: File[] | string | null;
      }[];
    }[];
};