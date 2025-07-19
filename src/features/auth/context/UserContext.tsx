import { 
  createContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { storage } from "@/shared/utils/storage";
import { AuthService } from "@/features/auth/services/authService";
import { UserContextType, User } from "@/features/auth/types";

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = storage.getUser<User>();
    const token = storage.getToken();

    if (savedUser && token) {
      setUser(savedUser);
    }
  }, []);

  const login = async ({ email, password }: {email: string, password: string}): Promise<boolean> => {
    try {
      const response = await AuthService.login(email, password);
      if (!response) return false;
  
      storage.setToken(response.token);
      storage.setUser(response.user);
      setUser(response.user);
      return true;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    storage.clear();
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
