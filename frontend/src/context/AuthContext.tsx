import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          // You might want to add an endpoint to verify token and get user info
          // const response = await axios.get('/api/user/');
          // setUser(response.data);
        } catch (error) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login/`, {
      email,
      password,
    });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    // Fetch user data if needed
    // const userResponse = await axios.get('/api/user/');
    // setUser(userResponse.data);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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