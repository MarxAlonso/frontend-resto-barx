import { useState } from 'react';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

// Mock data - en producción vendría del backend
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-01-15T14:30:00Z',
    status: 'delivered',
    items: [
      { name: 'Anticucho de Corazón', quantity: 2, price: 25.90 },
      { name: 'Chicha Morada', quantity: 1, price: 8.90 }
    ],
    total: 60.70
  },
  {
    id: 'ORD-002',
    date: '2024-01-16T19:15:00Z',
    status: 'preparing',
    items: [
      { name: 'Parrilla Mixta', quantity: 1, price: 45.90 },
      { name: 'Cerveza Pilsen', quantity: 2, price: 12.90 }
    ],
    total: 71.70
  },
  {
    id: 'ORD-003',
    date: '2024-01-17T12:00:00Z',
    status: 'ready',
    items: [
      { name: 'Lomo Saltado', quantity: 1, price: 32.90 },
      { name: 'Suspiro Limeño', quantity: 1, price: 14.90 }
    ],
    total: 47.80
  }
];

const getStatusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'ready': return 'bg-green-100 text-green-800 border-green-200';
    case 'delivered': return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusText = (status: Order['status']) => {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'preparing': return 'Preparando';
    case 'ready': return 'Listo';
    case 'delivered': return 'Entregado';
    case 'cancelled': return 'Cancelado';
    default: return 'Desconocido';
  }
};

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending': return '⏳';
    case 'preparing': return '👨‍🍳';
    case 'ready': return '✅';
    case 'delivered': return '📦';
    case 'cancelled': return '❌';
    default: return '❓';
  }
};

export default function ClientOrders() {
  const [orders] = useState<Order[]>(mockOrders);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Mis Pedidos</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Revisa el estado de todos tus pedidos y su historial.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedStatus === 'all'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedStatus === 'pending'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setSelectedStatus('preparing')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedStatus === 'preparing'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              En Preparación
            </button>
            <button
              onClick={() => setSelectedStatus('ready')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedStatus === 'ready'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              Listos
            </button>
            <button
              onClick={() => setSelectedStatus('delivered')}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                selectedStatus === 'delivered'
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
              }`}
            >
              Entregados
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay pedidos</h3>
              <p className="text-gray-500">No tienes pedidos en esta categoría.</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <span className="text-2xl">{getStatusIcon(order.status)}</span>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Pedido #{order.id}</h3>
                        <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="text-xl font-bold text-orange-600">S/ {order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Productos:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-semibold text-orange-600">S/ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      {order.status === 'ready' && (
                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                          Confirmar Recogida
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'preparing') && (
                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                          Cancelar Pedido
                        </button>
                      )}
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                        Ver Detalles
                      </button>
                      {order.status === 'delivered' && (
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                          Volver a Pedir
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}