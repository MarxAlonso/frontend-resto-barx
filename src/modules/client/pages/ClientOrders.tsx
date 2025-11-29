import { useEffect, useState } from 'react';
import { orderAPI } from '../../../services/api';

interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  createdAt: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | 'PAID';
  totalPrice: number;
  items: OrderItem[];
}

export default function ClientOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  interface ApiError {
    userMessage?: string;
    message?: string;
    response?: {
      data?: { message?: string };
    };
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getUserOrders();
        //console.log("🔑 Token actual:", localStorage.getItem("token"));
        //console.log("📦 Respuesta del backend:", res);
        //console.log("📦 Órdenes recibidas:", res.data);
        //setOrders(res.data.data || res.data || []);// ✅ acceder a la propiedad data interna

        const rawOrders = res.data.data || res.data || [];
        // Transformar los nombres de las propiedades
        interface RawOrderItem {
          menu_id: number;
          title: string;
          price: string; // viene como string del backend
          quantity: number;
        }

        interface RawOrder {
          id: number;
          created_at: string;
          status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
          total_price: string;
          items: RawOrderItem[];
        }

        const formattedOrders: Order[] = (rawOrders as RawOrder[]).map((o) => ({
          id: o.id,
          createdAt: o.created_at,
          status: o.status,
          totalPrice: parseFloat(o.total_price),
          items: o.items.map((item) => ({
            id: item.menu_id,
            title: item.title,
            price: parseFloat(item.price),
            quantity: item.quantity,
          })),
        }));

        setOrders(formattedOrders);

      } catch (err) {
        const error = err as ApiError;
        alert(
          error.userMessage ||
          error.response?.data?.message ||
          error.message ||
          'Error al obtener los pedidos.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      case 'PAID': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'PROCESSING': return 'En preparación';
      case 'COMPLETED': return 'Entregado';
      case 'CANCELLED': return 'Cancelado';
      case 'PAID': return 'Pagado';
      default: return 'Desconocido';
    }
  };

  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(o => o.status === selectedStatus);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Cargando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
          <p className="text-lg text-gray-600">Revisa el estado de tus pedidos.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtro */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {['all', 'PENDING', 'PROCESSING', 'COMPLETED', 'CANCELLED'].map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${selectedStatus === s
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                }`}
            >
              {s === 'all' ? 'Todos' : getStatusText(s)}
            </button>
          ))}
        </div>

        {/* Lista de pedidos */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay pedidos</h3>
            <p className="text-gray-500">No tienes pedidos en esta categoría.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Pedido #{order.id}</h3>
                  <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <span className="text-xl font-bold text-orange-600">S/ {order.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Productos:</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                      <span>{item.title} x{item.quantity}</span>
                      <span className="font-semibold text-orange-600">
                        S/ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
