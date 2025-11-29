import axios from "axios";

// Configuración base de la API
export const api = axios.create({
  //import.meta.env.VITE_API_URL || 
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8089/api",
  timeout: 20000, // 10 segundos de timeout
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
      //console.log("📦 Token enviado:", token); // esto estemporalmente
    } else {
      console.warn("⚠️ No hay token guardado en localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
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

// Funciones de la API para el backend de Spring Boot
export const authAPI = {
  // Login de usuario
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // Registro de usuario
  register: async (userData: { name: string; email: string; password: string; role?: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Verificar token
  verifyToken: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  }
};

export const menuAPI = {
  // Obtener menú completo
  getMenu: async () => {
    const response = await api.get('/menu');
    return response.data;
  },

  // Obtener los 3 primeros menús
  getFeatured: async () => {
    const response = await api.get('/menu/featured');
    return response.data;
  },

  // Crear nuevo ítem del menú
  createMenu: async (data: Partial<MenuItem>) =>
    (await api.post('/menu', data)).data,

  // Actualizar ítem existente
  updateMenu: async (id: number, data: Partial<MenuItem>) =>
    (await api.put(`/menu/${id}`, data)).data,

  // Eliminar ítem del menú
  deleteMenu: async (id: number) =>
    (await api.delete(`/menu/${id}`)).data,
};


export const orderAPI = {
  // Crear orden (pedidos)
  createOrder: async (orderData: {
    items: Array<{ menuId: number; quantity: number }>;
    totalPrice: number;
  }) => {
    const response = await api.post('/orders', orderData);
    return response.data as ApiResponse<{ orderId: number }>;
  },

  // Obtener órdenes del usuario
  getUserOrders: async () => {
    const response = await api.get('/orders/user');
    return response.data;
  },

  // Obtener todas las órdenes (admin) con filtros opcionales
  getAllOrders: async (filters?: { startDate?: string; endDate?: string; status?: string; userId?: number }) => {
    const response = await api.get('/orders', { params: filters });
    return response.data;
  },

  // Actualizar estado de orden (admin)
  updateOrderStatus: async (orderId: number, status: string) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  }
};

// Función para verificar si el backend está disponible
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    await api.get('/health', { timeout: 3000 });
    return true;
  } catch (error) {
    console.error('🏥 Backend no disponible:', error);
    throw new Error('El servidor backend no está disponible. Asegúrate de que esté ejecutándose en http://localhost:8089');
  }
};

export const userAPI = {
  updateProfile: async (userId: number, data: { name?: string; phone?: string; email?: string; isActive?: boolean }) => {
    const res = await api.put(`/users/${userId}`, data);
    return res.data;
  },
  getClients: async () => {
    const res = await api.get('/users/clients');
    return res.data;
  },
  createClient: async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await api.post('/users', data);
    return res.data;
  },
  deleteClient: async (id: number) => {
    await api.delete(`/users/${id}`);
  }
};

export const paymentAPI = {
  processPayment: async (paymentData: any) => {
    const response = await api.post('/payments/process_payment', paymentData);
    return response.data;
  },
  getPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  }
};

// Llamando al menu por la api
export interface MenuItem {
  id: number;
  title: string;
  description: string;
  price: number;
  category: { id: number; name: string };
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}


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