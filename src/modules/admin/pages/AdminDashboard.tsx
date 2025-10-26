import { useState, useEffect } from 'react';
import { orderAPI, userAPI, menuAPI } from '../../../services/api';
import { Link } from 'react-router-dom';
interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
}

interface RecentOrder {
  id: number;
  customer: string;
  total: number;
  status: string;
  time: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayOrders: 0,
    todayRevenue: 0,
    pendingOrders: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener fecha de hoy para filtros
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch all data in parallel
      const [ordersResponse, usersResponse] = await Promise.all([
        orderAPI.getAllOrders({ startDate: today, endDate: today }),
        userAPI.getClients(),
        menuAPI.getMenu()
      ]);

// ✅ Obtener órdenes del día
const todayOrders = ordersResponse.data || [];

const todayRevenue = todayOrders.reduce(
  (sum: number, order: any) => sum + Number(order.total_price || 0),
  0
);

const pendingOrders = todayOrders.filter(
  (order: any) => order.status === 'pending'
).length;

// ✅ Obtener todas las órdenes recientes (si tu backend devuelve todas aquí mismo)
const allOrders = ordersResponse.data || [];
const recent = allOrders.slice(0, 4).map((order: any) => ({
  id: order.id,
  customer: order.user?.name || 'Cliente Anónimo',
  total: Number(order.total_price || 0),
  status: order.status,
  time: new Date(order.created_at).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit'
  })
}));

      // Actualizar estados
      setStats({
        todayOrders: todayOrders.length,
        todayRevenue,
        pendingOrders,
        totalCustomers: usersResponse.data?.length || 0
      });
      setRecentOrders(recent);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.userMessage || 'Error al cargar los datos del dashboard');
      
      // Fallback a datos mock en caso de error
      setStats({
        todayOrders: 0,
        todayRevenue: 0,
        pendingOrders: 0,
        totalCustomers: 0
      });
      setRecentOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo';
      case 'delivered': return 'Entregado';
      default: return 'Desconocido';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-2">¡Bienvenido al Panel de Administración!</h2>
          <p className="opacity-90">Cargando datos del dashboard...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">¡Bienvenido al Panel de Administración!</h2>
        <p className="opacity-90">
          {error ? 'Algunos datos pueden no estar actualizados' : 'Aquí tienes un resumen de la actividad de hoy en Resto BarX'}
        </p>
        {error && (
          <div className="mt-2 text-sm bg-red-500/20 border border-red-300 rounded p-2">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Hoy</p>
              <p className="text-3xl font-bold text-gray-900">{stats.todayOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📋</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+12% vs ayer</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Hoy</p>
              <p className="text-3xl font-bold text-gray-900">S/ {stats.todayRevenue.toFixed(2)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+8% vs ayer</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos Pendientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⏳</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-600 text-sm font-medium">Requiere atención</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCustomers}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">+5 nuevos esta semana</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Pedidos Recientes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-sm text-gray-600">#{order.id} - {order.time}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="font-semibold text-orange-600">S/ S/ {Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay pedidos recientes</p>
                  <p className="text-sm mt-1">Los pedidos aparecerán aquí cuando se realicen</p>
                </div>
              )}
            </div>
            <div className="mt-4 text-center">
              <button 
                onClick={fetchDashboardData}
                className="text-orange-600 hover:text-orange-700 font-medium mr-4"
              >
                🔄 Actualizar
              </button>
              <button className="text-orange-600 hover:text-orange-700 font-medium">Ver todos los pedidos</button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/menu" className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors">
                <div className="text-2xl mb-2">🍽️</div>
                <div className="text-sm font-medium text-green-900">Agregar Plato</div>
              </Link>
              <Link to="/admin/customers" className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors">
                <div className="text-2xl mb-2">👤</div>
                <div className="text-sm font-medium text-purple-900">Nuevo Cliente</div>
              </Link>
              <Link to="/admin/reportes" className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-center transition-colors">
                <div className="text-2xl mb-2">📊</div>
                <div className="text-sm font-medium text-orange-900">Ver Reportes</div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}