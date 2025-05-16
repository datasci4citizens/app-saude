import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "@/api/services/AuthService";

type AuthContextType = {
  user: {
    token: string;
    person_id?: number;
  } | null;
  login: (code: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  const login = async (code: string) => {
    try {
      const response = await AuthService.authLoginGoogleCreate({ code });
      localStorage.setItem("token", response.access);

      // Buscar dados do usuário após login
      const me = await AuthService.authMeRetrieve();

      setUser({
        token: response.access,
        person_id: me.person_id, // Supondo que a resposta inclua person_id
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const me = await AuthService.authMeRetrieve();
          setUser({
            token,
            person_id: me.person_id,
          });
        } catch (error) {
          console.error("Session validation failed:", error);
          logout();
        }
      }
    };
    initAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
