import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types/types";
import { authService } from "../service/auth.service";

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used in AuthProvider!!");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await authService.getUser();
      if (res.success) {
        setUser(res.user);
      }
    } catch (error) {
      console.log("failed to fetch user!!", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string) => {
    try {
      const response = await authService.login(email);
      if (response.success) {
        setUser(response.user);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      setUser(null);
      throw error;
    }
  };
  
  const value = {
    isLoading,
    login,
    user,
    logout,
    isAuthenticated: !!user,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};