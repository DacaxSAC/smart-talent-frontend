export type LoginResponse = {
  message: string;
  token: string;
  user: {
    id: number;
    entityId: number;
    username: string;
    email: string;
    roles: string[];
  };
}

export interface User {
  id: number;
  entityId: number;
  username: string;
  email: string;
  roles: string[];
}

export interface UserContextType {
  user: User | null;
  login: (credentials: {email: string, password: string}) => Promise<{success: boolean, message: string}>;
  logout: () => void;
}