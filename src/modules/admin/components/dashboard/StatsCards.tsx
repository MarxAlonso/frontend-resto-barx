interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  pendingOrders: number;
  totalCustomers: number;
}

interface Props {
  stats: DashboardStats;
}

export default function StatsCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      {/* Card - Pedidos Hoy */}
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

      {/* Card - Ingresos Hoy */}
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

      {/* Card - Pendientes */}
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

      {/* Card - Clientes Totales */}
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
  );
}
