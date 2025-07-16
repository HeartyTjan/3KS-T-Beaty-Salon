import React, { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, AuthResponse } from '@/lib/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize user from localStorage immediately to prevent flash
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    // Initialize token from localStorage immediately to prevent flash
    return localStorage.getItem('token');
  });
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          // Only verify token if we don't already have user data
          if (!user) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          }
          // Verify token is still valid in the background
          const response = await authAPI.getCurrentUser();
          if (response) {
            setUser(response); // response is the user object
            localStorage.setItem('user', JSON.stringify(response));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      console.log(response);
      const { token: newToken, user: newUser } = response;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      const backendMsg = error?.response?.data?.message;
      console.error('Login error:', error);
      if (!backendMsg || backendMsg.toLowerCase().includes('bad credentials')) {
        throw new Error('Invalid username or password');
      }
      throw new Error(backendMsg || 'Login failed');
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, phone?: string) => {
    try {
      const response = await authAPI.register({ firstName, lastName, email, password, phone });
      
      if (response.success) {
        const { token: newToken, user: newUser } = response.data;
        
        setToken(newToken);
        setUser(newUser);
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await authAPI.forgotPassword(email);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to send password reset email');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const isAuthenticated = !!user && !!token;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 