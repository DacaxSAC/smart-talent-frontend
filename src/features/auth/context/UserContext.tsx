import { 
  createContext, 
  useState, 
  useEffect, 
  ReactNode 
} from "react";
import { storage } from "@/shared/utils/storage";
//import { AuthService } from "@/features/auth/services/authService";
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

  const login = async ({ email, password }: {email: string, password: string}): Promise<{success: boolean, message:string}> => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      console.log(response);
  
      const data = await response.json();

      if(!data.success){
        return {success: false, message: data.message};
      }
      storage.setToken(data.token);
      storage.setUser(data.user);
      setUser(data.user);
      return {success: true, message: 'Login exitoso'};
    } catch (error) {
      console.error("Error en login:", error);
      return {success: false, message: 'Error en login'};
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
