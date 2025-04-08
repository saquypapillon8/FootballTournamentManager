import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  teamId: number | null;
  statisticsId: number | null;
  dateRegistered: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check for token in localStorage on initial load
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      fetchUserProfile(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      const res = await fetch("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        credentials: "include",
      });

      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else {
        // If token is invalid, clear it
        localStorage.removeItem("token");
        setToken(null);
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await res.json();
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur FootTournoi!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Échec de la connexion",
        description: error.message || "Vérifiez vos identifiants et réessayez",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/register", { 
        name, 
        email, 
        password,
        role: "player" 
      });
      const data = await res.json();
      
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès!",
      });
      
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Échec de l'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/");
    
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès",
    });
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = isAuthenticated && (user?.role === "admin" || user?.role === "superadmin");
  const isSuperAdmin = isAuthenticated && user?.role === "superadmin";

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      isLoading, 
      login, 
      register, 
      logout,
      isAdmin,
      isSuperAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
