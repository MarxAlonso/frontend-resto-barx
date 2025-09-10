import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI, checkBackendHealth, type LoginResponse } from '../services/api';

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
        
        try {
          // Verificar que el backend esté disponible y el token sea válido
          await checkBackendHealth();
          await authAPI.verifyToken();
          setIsOfflineMode(false);
          console.log('✅ Token válido y backend disponible');
        } catch (error) {
          console.error('❌ Token inválido o backend no disponible:', error);
          // Limpiar datos si el token no es válido
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
          setIsOfflineMode(true);
        }
      }
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error);
      // Limpiar datos corruptos
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      // Verificar que el backend esté disponible
      await checkBackendHealth();
      setIsOfflineMode(false);
      
      // Usar API del backend de Spring Boot
      const response = await authAPI.login(email, password);
      
      const { token: newToken, user: newUser } = response;
      
      // Crear usuario con el tipo correcto
      const userWithCorrectType: User = {
        id: String(newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as 'CLIENT' | 'ADMIN'
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
      // Verificar que el backend esté disponible
      await checkBackendHealth();
      setIsOfflineMode(false);
      
      // Usar API del backend de Spring Boot
      const response = await authAPI.login(email, password);
      
      const { token: newToken, user: newUser } = response;
      
      // Verificar que el usuario sea cliente
      if (newUser.role !== 'CLIENT') {
        return {
          success: false,
          error: 'Este usuario no tiene permisos de cliente.'
        };
      }
      
      // Crear usuario con el tipo correcto
      const userWithCorrectType: User = {
        id: String(newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: 'CLIENT'
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
      // Verificar que el backend esté disponible
      await checkBackendHealth();
      setIsOfflineMode(false);
      
      // Usar API del backend de Spring Boot
      const response = await authAPI.login(email, password);
      
      const { token: newToken, user: newUser } = response;
      
      // Verificar que el usuario sea administrador
      if (newUser.role !== 'ADMIN') {
        return {
          success: false,
          error: 'Este usuario no tiene permisos de administrador.'
        };
      }
      
      // Crear usuario con el tipo correcto
      const userWithCorrectType: User = {
        id: String(newUser.id),
        name: newUser.name,
        email: newUser.email,
        role: 'ADMIN'
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
    return user?.role === 'CLIENT';
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN';
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