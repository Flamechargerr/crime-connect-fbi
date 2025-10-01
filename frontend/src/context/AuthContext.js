import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    // Simulate auth check
    const checkAuth = async () => {
      try {
        // Check if user is logged in from localStorage
        const storedUser = localStorage.getItem('fbi_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          setIsDemo(userData.demo || false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // Demo login logic
      if (credentials.email === 'demo@fbi.gov' && credentials.password === 'demo123') {
        const demoUser = {
          id: 1,
          username: 'Agent Demo',
          email: 'demo@fbi.gov',
          clearanceLevel: 'SECRET',
          badge: 'FBI-7734',
          demo: true
        };
        
        localStorage.setItem('fbi_user', JSON.stringify(demoUser));
        setUser(demoUser);
        setIsAuthenticated(true);
        setIsDemo(true);
        return { success: true };
      }
      
      // Regular login would go here
      throw new Error('Invalid credentials');
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Mock registration
      const newUser = {
        id: Date.now(),
        username: userData.username,
        email: userData.email,
        clearanceLevel: 'CONFIDENTIAL',
        badge: `FBI-${Math.floor(Math.random() * 10000)}`,
        demo: false
      };
      
      localStorage.setItem('fbi_user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      setIsDemo(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('fbi_user');
    setUser(null);
    setIsAuthenticated(false);
    setIsDemo(false);
  };

  const value = {
    isAuthenticated,
    loading,
    user,
    isDemo,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};