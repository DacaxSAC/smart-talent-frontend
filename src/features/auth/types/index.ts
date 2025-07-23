export type LoginResponse = {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    roles: string[];
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

export interface UserContextType {
  user: User | null;
  login: (credentials: {email: string, password: string}) => Promise<{success: boolean, message: string}>;
  logout: () => void;
}