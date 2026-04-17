import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { api, clearAuthToken, extractApiError, getAuthToken, setAuthToken } from '@/lib/api';

type UserRole = 'admin' | 'analyst';

interface AuthUser {
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  role?: UserRole | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  resetPassword: async () => {},
  isAuthenticated: false,
  role: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        if (!getAuthToken()) {
          return;
        }
        const response = await api.get('/auth/me');
        const resolvedUser = response?.data as AuthUser;
        if (resolvedUser?.email && resolvedUser?.role) {
          setUser(resolvedUser);
        }
      } catch {
        clearAuthToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const accessToken = response?.data?.access_token as string | undefined;
      const nextUser = response?.data?.user as AuthUser | undefined;

      if (!accessToken || !nextUser?.email || !nextUser?.role) {
        throw new Error('Invalid authentication response');
      }

      setAuthToken(accessToken, remember);
      setUser(nextUser);
    } catch (error) {
      clearAuthToken();
      setUser(null);
      throw new Error(extractApiError(error, 'Unable to authenticate'));
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    clearAuthToken();
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { email, password });
      const accessToken = response?.data?.access_token as string | undefined;
      const nextUser = response?.data?.user as AuthUser | undefined;

      if (!accessToken || !nextUser?.email || !nextUser?.role) {
        throw new Error('Invalid registration response');
      }

      setAuthToken(accessToken, false);
      setUser(nextUser);
    } catch (error) {
      clearAuthToken();
      setUser(null);
      throw new Error(extractApiError(error, 'Unable to register'));
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await api.post('/auth/reset-password', { email });
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      register,
      resetPassword,
      isAuthenticated: Boolean(user),
      role: user?.role ?? null,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
