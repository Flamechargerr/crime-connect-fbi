import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, login as apiLogin, register as apiRegister } from '@/lib/api';

interface AuthContextType {
  user: { id: string; email: string; name: string; role: string } | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    localStorage.setItem('token', res.access_token);
    const me = await getMe();
    setUser(me);
  };

  const register = async (email: string, password: string, name: string) => {
    const res = await apiRegister(email, password, name);
    localStorage.setItem('token', res.access_token);
    const me = await getMe();
    setUser(me);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
