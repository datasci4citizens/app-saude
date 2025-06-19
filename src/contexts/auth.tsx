import { createContext, useContext, useState, useEffect } from "react";
import { AuthService } from "@/api/services/AuthService";

// Define the shape of the context for authentication
type AuthContextType = {
  user: {
    token: string; // JWT token for authentication
    person_id?: number; // Optional person ID from user data
  } | null; // User state can be null if not authenticated
  login: (code: string) => Promise<void>; // Login function that accepts a code
  logout: () => void; // Logout function to clear user data
};

// Create the authentication context
const AuthContext = createContext<AuthContextType>(null!);

/**
 * AuthProvider component to encapsulate authentication logic and state.
 *
 * @param {React.ReactNode} children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthProvider wrapping its children with context.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // State to hold the authenticated user info
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  /**
   * Login function to authenticate the user with the provided code.
   *
   * @param {string} code - The authentication code for login.
   * @returns {Promise<void>} A promise that resolves once the login is complete.
   */
  const login = async (code: string) => {
    try {
      // Authenticate using the provided code and store the token in local storage
      const response = await AuthService.authLoginGoogleCreate({ code });
      localStorage.setItem("token", response.access);

      // Retrieve user data after successful login
      const me = await AuthService.authMeRetrieve();

      setUser({
        token: response.access,
        person_id: me.person_id, // Assuming the response includes person_id
      });
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  /**
   * Logout function to clear the user session.
   * It removes the token from local storage and resets the user state.
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Effect to initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Validate session and retrieve user data
          const me = await AuthService.authMeRetrieve();
          setUser({
            token,
            person_id: me.person_id, // Set user state with retrieved person_id
          });
        } catch (error) {
          console.error("Session validation failed:", error);
          logout(); // If validation fails, logout the user
        }
      }
    };
    initAuth(); // Call the initialization function on component mount
  }, []);

  // Provide the user state and actions to the context
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Custom hook to access authentication context.
 *
 * @returns {AuthContextType} The current authentication context values.
 */
export function useAuth() {
  return useContext(AuthContext);
}
