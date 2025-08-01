'use client';
import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


interface User {
  id: number;
  email: string;
  name: string;
  avatar:string ;
  full_name: string;}
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  socialLogin: (userData: User, access: string, refresh: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
        try {
          // You might want to add an endpoint to verify token and get user info
          // const response = await axios.get('/api/user/');
           setUser(JSON.parse(userData));
        } catch (error) {

          if (axios.isAxiosError(error) && error.response?.status === 401) {
            // If token is invalid, clear local storage and redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setUser(null);
            router.push('/auth/login');
          } else {
            console.error('Failed to load user:', error);
          }
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

const socialLogin = (userData: User, access: string, refresh: string) => {
  localStorage.setItem("access_token", access);
  localStorage.setItem("refresh_token", refresh);
  localStorage.setItem("user", JSON.stringify(userData));
  setUser(userData);
};


  const login = async (email: string, password: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
      email,
      password,
    });
    const { access, refresh, user: userData } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    localStorage.setItem('user', JSON.stringify(userData));
    // Fetch user data if needed
    // const userResponse = await axios.get('/api/user/');
    // setUser(userResponse.data);

    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/login');
  }; 

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        socialLogin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}