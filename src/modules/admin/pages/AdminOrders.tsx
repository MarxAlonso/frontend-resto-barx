import { useEffect, useState } from "react";
import { orderAPI } from "../../../services/api";

export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED";

interface OrderItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  userName: string;
  userEmail: string;
  createdAt: string;
  status: OrderStatus;
  totalPrice: number;
  items: OrderItem[];
}
interface ApiOrderItem {
  title: string;
  price: string | number;
  quantity: number;
}

interface ApiOrder {
  id: number;
  user_name: string;
  user_email: string;
  created_at: string;
  status: OrderStatus;
  total_price: string | number;
  items: ApiOrderItem[];
}

// Componente principal
export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // 📡 Obtener pedidos del backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderAPI.getAllOrders();
        const data = res.data.data || res.data || [];

        const formatted = (data as ApiOrder[]).map((o) => ({
          id: o.id,
          userName: o.user_name,
          userEmail: o.user_email,
          createdAt: o.created_at,
          status: o.status,
          totalPrice: Number(o.total_price),
          items: o.items.map((item, index) => ({
            id: index,
            title: item.title,
            price: Number(item.price),
            quantity: item.quantity,
          })),
        }));


        setOrders(formatted);
        setFilteredOrders(formatted);
      } catch (error) {
        console.error("❌ Error al obtener órdenes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Funciones de ayuda
  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );

      setFilteredOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
    }
  };


  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PROCESSING": return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED": return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("es-PE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const totalEarnings = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((acc, o) => acc + o.totalPrice, 0);

  const getCountByStatus = (status: OrderStatus) =>
    orders.filter((o) => o.status === status).length;

  const filterOrders = (status: string) => {
    setSelectedStatus(status);
    if (status === "all") setFilteredOrders(orders);
    else setFilteredOrders(orders.filter((o) => o.status === status));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Cargando pedidos...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Pedidos
          </h1>
          <p className="text-gray-600 mt-1">
            Administra pedidos y controla el flujo del restaurante 🍽️
          </p>
        </div>
        <div className="bg-white shadow rounded-xl px-5 py-3 text-center">
          <p className="text-sm text-gray-600">Ganancia Total</p>
          <p className="text-2xl font-bold text-orange-600">
            S/ {totalEarnings.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Cards resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-6">
        {[
          { label: "Pendientes", status: "PENDING", color: "text-yellow-600", icon: "⏳" },
          { label: "En Proceso", status: "PROCESSING", color: "text-blue-600", icon: "👨‍🍳" },
          { label: "Completadas", status: "COMPLETED", color: "text-green-600", icon: "✅" },
          { label: "Canceladas", status: "CANCELLED", color: "text-red-600", icon: "❌" },
        ].map((card) => (
          <div
            key={card.status}
            className="bg-white p-5 rounded-xl shadow hover:shadow-md transition cursor-pointer"
            onClick={() => filterOrders(card.status)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className={`text-2xl font-bold ${card.color}`}>
                  {getCountByStatus(card.status as OrderStatus)}
                </p>
              </div>
              <span className="text-3xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: "all", label: "Todos" },
          { key: "PENDING", label: "Pendientes" },
          { key: "PROCESSING", label: "En preparación" },
          { key: "COMPLETED", label: "Completados" },
          { key: "CANCELLED", label: "Cancelados" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => filterOrders(f.key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedStatus === f.key
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tabla de pedidos */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                {["ID", "Cliente", "Fecha", "Estado", "Total", "Acciones"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 text-gray-700">
                    <p>{order.userName}</p>
                    <p className="text-sm text-gray-500">{order.userEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-orange-600 font-semibold">
                    S/ {order.totalPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                    >
                      Ver
                    </button>
                    <select
                    value={order.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as OrderStatus;
                      if (newStatus !== order.status) {
                        const confirmChange = window.confirm(
                          `¿Confirmas cambiar el estado a "${newStatus}"?`
                        );
                        if (confirmChange) updateOrderStatus(order.id, newStatus);
                      }
                    }}
                    className={`text-sm rounded-lg border px-2 py-1 font-medium cursor-pointer ${
                      order.status === "PENDING"
                        ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                        : order.status === "PROCESSING"
                        ? "bg-blue-50 border-blue-300 text-blue-700"
                        : order.status === "COMPLETED"
                        ? "bg-green-50 border-green-300 text-green-700"
                        : "bg-red-50 border-red-300 text-red-700"
                    }`}
                  >
                    <option value="PENDING">Pendiente</option>
                    <option value="PROCESSING">En proceso</option>
                    <option value="COMPLETED">Completado</option>
                    <option value="CANCELLED">Cancelado</option>
                  </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal detalle */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalles del Pedido #{selectedOrder.id}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Cliente</h4>
                  <p>{selectedOrder.userName}</p>
                  <p className="text-sm text-gray-500">
                    {selectedOrder.userEmail}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Información</h4>
                  <p>
                    <strong>Fecha:</strong> {formatDate(selectedOrder.createdAt)}
                  </p>
                  <p>
                    <strong>Estado:</strong> {selectedOrder.status}
                  </p>
                  <p>
                    <strong>Total:</strong> S/{" "}
                    {selectedOrder.totalPrice.toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Productos</h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((i) => (
                    <div
                      key={i.id}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                    >
                      <span>
                        {i.title} x{i.quantity}
                      </span>
                      <span className="font-semibold text-orange-600">
                        S/ {(i.price * i.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
