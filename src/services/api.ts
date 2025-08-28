import axios from "axios";

// Configuración base de la API
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8089/api",
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adjuntar token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejo de errores cuando el backend no está disponible
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.warn('🚫 Backend no disponible - Modo offline');
      error.isOffline = true;
      error.userMessage = 'El servidor no está disponible en este momento. Por favor, inténtalo más tarde.';
    } else if (error.code === 'ECONNABORTED') {
      console.warn('⏱️ Timeout de conexión');
      error.userMessage = 'La conexión está tardando demasiado. Verifica tu conexión a internet.';
    } else if (error.response) {
      // El servidor respondió con un código de error
      const status = error.response.status;
      switch (status) {
        case 401:
          error.userMessage = 'Credenciales incorrectas. Verifica tu email y contraseña.';
          // Limpiar token inválido
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          break;
        case 403:
          error.userMessage = 'No tienes permisos para realizar esta acción.';
          break;
        case 404:
          error.userMessage = 'Recurso no encontrado.';
          break;
        case 422:
          error.userMessage = 'Datos inválidos. Verifica la información ingresada.';
          break;
        case 500:
          error.userMessage = 'Error interno del servidor. Por favor, inténtalo más tarde.';
          break;
        default:
          error.userMessage = `Error del servidor (${status}). Por favor, inténtalo más tarde.`;
      }
    } else {
      error.userMessage = 'Error de conexión. Verifica tu conexión a internet.';
    }
    
    return Promise.reject(error);
  }
);

// Funciones de utilidad para simular respuestas cuando el backend no esté disponible
export const mockResponses = {
  // Simular login exitoso para desarrollo
  mockLogin: (email: string, password: string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'admin@toritogrill.com' && password === 'admin123') {
          resolve({
            data: {
              token: 'mock-jwt-token-' + Date.now(),
              user: {
                id: 1,
                name: 'Administrador',
                email: 'admin@toritogrill.com',
                role: 'admin'
              }
            }
          });
        }
        if (email === 'cliente@toritogrill.com' && password === 'cliente123') {
          resolve({
            data: {
              token: 'mock-jwt-token-' + Date.now(),
              user: {
                id: 1,
                name: 'Cliente',
                email: 'cliente@toritogrill.com',
                role: 'client'
              }
            }
          });
        } else {
          reject({
            response: {
              status: 401,
              data: { message: 'Credenciales incorrectas' }
            }
          });
        }
      }, 1500); // Simular delay de red
    });
  },
  
  // Simular obtener menú
  mockGetMenu: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            menu: [], // Se usará el menú local de menu.ts
            message: 'Menú obtenido exitosamente'
          }
        });
      }, 1000);
    });
  }
};

// Función para verificar si el backend está disponible
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health', { timeout: 3000 });
    return true;
  } catch (error) {
    console.warn('🏥 Backend health check failed:', error);
    return false;
  }
};

// Tipos para las respuestas de la API
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success?: boolean;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role?: string;
  };
}

export interface MenuResponse {
  menu: Array<{
    id: string;
    title: string;
    price: number;
    desc: string;
    category: string;
    image?: string;
  }>;
}