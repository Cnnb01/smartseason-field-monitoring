import React, {createContext, useState, useEffect, useContext} from "react";
import type { User } from '../types/index'
import api from "../api/axios";

interface AuthContextType {
  user: User | null;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  loading: boolean
}

// Create the Context: Use createContext() to define the data structure that will hold authentication information.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the Provider: Create an AuthProvider component that uses useState or useReducer to manage the actual auth state.
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const checkAuth = async ()=>{
        const token = localStorage.getItem('access_token');
        if (token){
            try{
                const response = await api.get('users/me');
                setUser(response.data);
            }catch (error){
                logout()
            }
        }
        setLoading(false);
    }
    checkAuth();//if a user refreshes their browser, the app doesn't forget who they are. It checks localStorage, sees the token, and re-logs them in automatically
  }, []);

  const login = async (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    const response = await api.get('users/me');
    setUser(response.data);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
// Wrap the Application: Place the AuthProvider at the top level of your component tree (typically in App.js or main.js) to make the data available to all children.

//Consume the Context: Use the useContext hook or a custom hook like useAuth() to access user data and login/logout functions in any component.