
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any | null; // Changed from SupabaseUser to any
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  isDemo?: boolean;
  role?: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  resetPassword: async () => {},
  isAuthenticated: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Changed from SupabaseUser to any
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Load persisted session (demo/local only)
    try {
      const stored = localStorage.getItem('auth_user');
      const isDemoStored = localStorage.getItem('auth_isDemo');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsDemo(isDemoStored === 'true');
      }
    } catch (e) {
      console.warn('Failed to load auth from storage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // DEMO BYPASS
    if (email === 'admin@gmail.com' && password === 'password') {
      const demoAdmin = {
        id: 'demo-admin',
        email: 'admin@gmail.com',
        role: 'admin',
        aud: 'authenticated',
        app_metadata: { provider: 'demo', providers: ['demo'] },
        user_metadata: { name: 'Demo Admin', role: 'admin' },
        created_at: new Date().toISOString(),
        email_confirmed_at: new Date().toISOString(),
        identities: [],
        last_sign_in_at: new Date().toISOString(),
        phone: '',
        confirmed_at: new Date().toISOString(),
        recovery_sent_at: '',
        banned_until: '',
        updated_at: new Date().toISOString(),
      } as any;
      setUser(demoAdmin);
      setIsDemo(true);
      // persist session
      localStorage.setItem('auth_user', JSON.stringify(demoAdmin));
      localStorage.setItem('auth_isDemo', 'true');
      setLoading(false);
      return;
    }
    setIsDemo(false);
    // No supabase login logic, always return success for demo
    setUser({
      id: 'demo-user',
      email: email,
      role: 'user',
      aud: 'authenticated',
      app_metadata: { provider: 'demo', providers: ['demo'] },
      user_metadata: { name: 'Demo User', role: 'user' },
      created_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      identities: [],
      last_sign_in_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      recovery_sent_at: '',
      banned_until: '',
      updated_at: new Date().toISOString(),
    } as any);
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    setIsDemo(false);
    // No supabase logout logic, always return success for demo
    setUser(null);
    setLoading(false);
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    // No supabase register logic, always return success for demo
    setUser({
      id: 'demo-user',
      email: email,
      role: 'user',
      aud: 'authenticated',
      app_metadata: { provider: 'demo', providers: ['demo'] },
      user_metadata: { name: 'Demo User', role: 'user' },
      created_at: new Date().toISOString(),
      email_confirmed_at: new Date().toISOString(),
      identities: [],
      last_sign_in_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      recovery_sent_at: '',
      banned_until: '',
      updated_at: new Date().toISOString(),
    } as any);
    setLoading(false);
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    // No supabase reset password logic, always return success for demo
    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        resetPassword,
        isAuthenticated: !!user,
        isDemo,
        role: user?.user_metadata?.role || (user as any)?.role || null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
