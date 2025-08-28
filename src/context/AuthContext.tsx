import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { api, mockResponses, checkBackendHealth, type LoginResponse } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isOfflineMode: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsClient: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsAdmin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuthStatus: () => void;
  isAuthenticated: () => boolean;
  isClient: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Verificar estado de autenticación al cargar
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        
        // Verificar si el backend está disponible
        const isBackendAvailable = await checkBackendHealth();
        setIsOfflineMode(!isBackendAvailable);
        
        if (!isBackendAvailable) {
          console.warn('🔄 Modo offline activado - usando datos locales');
        }
      }
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error);
      // Limpiar datos corruptos
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Primero verificar si el backend está disponible
      const isBackendAvailable = await checkBackendHealth();
      
      let response: { data: LoginResponse };
      
      if (isBackendAvailable) {
        // Usar API real
        response = await api.post<LoginResponse>('/auth/login', { email, password });
        setIsOfflineMode(false);
      } else {
        // Usar respuesta mock
        console.warn('🔄 Backend no disponible - usando login mock');
        const mockResponse = await mockResponses.mockLogin(email, password) as { data: LoginResponse };
        response = mockResponse;
        setIsOfflineMode(true);
      }
      
      const { token: newToken, user: newUser } = response.data;
      
      // Determinar rol basado en el email si no viene del backend
      if (!newUser.role) {
        newUser.role = email.includes('admin') ? 'admin' : 'client';
      }
      
      // Crear usuario con el tipo correcto
      const userWithCorrectType: User = {
        id: String(newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as 'client' | 'admin'
      };
      
      // Guardar en localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userWithCorrectType));
      
      // Actualizar estado
      setToken(newToken);
      setUser(userWithCorrectType);
      
      return { success: true };
      
    } catch (error: unknown) {
      console.error('Error en login:', error);
      
      // Usar el mensaje de error personalizado del interceptor
      const errorMessage = (error as { userMessage?: string })?.userMessage || 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsClient = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const isBackendAvailable = await checkBackendHealth();
      
      let response: { data: LoginResponse };
      
      if (isBackendAvailable) {
        response = await api.post<LoginResponse>('/auth/login', { email, password, role: 'client' });
        setIsOfflineMode(false);
      } else {
        console.warn('🔄 Backend no disponible - usando login mock de cliente');
        const mockResponse = await mockResponses.mockLogin(email, password) as { data: LoginResponse };
        response = mockResponse;
        setIsOfflineMode(true);
      }
      
      const { token: newToken, user: newUser } = response.data;
      
      // Crear usuario con el tipo correcto
      const userWithCorrectType: User = {
        id: String(newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: 'client'
      };
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userWithCorrectType));
      
      setToken(newToken);
      setUser(userWithCorrectType);
      
      return { success: true };
      
    } catch (error: unknown) {
      console.error('Error en login de cliente:', error);
      
      const errorMessage = (error as { userMessage?: string })?.userMessage || 'Error al iniciar sesión como cliente.';
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const isBackendAvailable = await checkBackendHealth();
      
      let response: { data: LoginResponse };
      
      if (isBackendAvailable) {
        response = await api.post<LoginResponse>('/auth/login', { email, password, role: 'admin' });
        setIsOfflineMode(false);
      } else {
        console.warn('🔄 Backend no disponible - usando login mock de administrador');
        const mockResponse = await mockResponses.mockLogin(email, password) as { data: LoginResponse };
        response = mockResponse;
        setIsOfflineMode(true);
      }
      
      const { token: newToken, user: newUser } = response.data;
      
      // Crear usuario con el tipo correcto
      const userWithCorrectType: User = {
        id: String(newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: 'admin'
      };
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userWithCorrectType));
      
      setToken(newToken);
      setUser(userWithCorrectType);
      
      return { success: true };
      
    } catch (error: unknown) {
      console.error('Error en login de administrador:', error);
      
      const errorMessage = (error as { userMessage?: string })?.userMessage || 'Error al iniciar sesión como administrador.';
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpiar estado
    setToken(null);
    setUser(null);
    setIsOfflineMode(false);
    
    console.log('👋 Sesión cerrada exitosamente');
  };

  const isAuthenticated = () => {
    return user !== null && token !== null;
  };

  const isClient = () => {
    return user?.role === 'client';
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isOfflineMode,
    login,
    loginAsClient,
    loginAsAdmin,
    logout,
    checkAuthStatus,
    isAuthenticated,
    isClient,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;