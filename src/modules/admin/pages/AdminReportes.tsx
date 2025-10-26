import { useEffect, useMemo, useState } from 'react';
import { menuAPI, orderAPI, userAPI } from '../../../services/api';

// Tipos locales para datos
interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  is_active?: boolean;
  created_at?: string;
}

interface OrderItemRow {
  menu_id: number;
  quantity: number;
  title?: string;
  price?: number;
}

interface OrderRow {
  id: number;
  user_id: number;
  total_price: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED' | string;
  created_at: string;
  updated_at: string;
  items?: OrderItemRow[];
}

interface MenuItem {
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
// Utilidad: formateo de moneda
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(value);

// Utilidad: descargar texto como archivo
const downloadFile = (filename: string, content: string, mime = 'text/plain') => {
  const blob = new Blob([content], { type: mime + ';charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

// Exportación simple a CSV
const toCSV = (rows: Record<string, any>[]) => {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val: any) => {
    const s = String(val ?? '');
    return '"' + s.replace(/"/g, '""') + '"';
  };
  const lines = [headers.join(',')].concat(
    rows.map((r) => headers.map((h) => escape(r[h])).join(','))
  );
  return lines.join('\n');
};

// Gráfico de barras básico (sin librerías)
function BarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="grid grid-cols-12 gap-2 items-end h-40">
      {data.map((d) => (
        <div key={d.label} className="flex flex-col items-center">
          <div
            className="w-full bg-blue-500 rounded-sm"
            style={{ height: `${(d.value / max) * 100}%` }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-xs mt-1 truncate" title={d.label}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminReportes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [status, setStatus] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Órdenes con filtros (si hay)
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (status) params.status = status;

      const [ordersRes, clientsRes, menuRes] = await Promise.all([
        orderAPI.getAllOrders(params),
        userAPI.getClients(),
        menuAPI.getMenu(),
      ]);

      // Los endpoints existentes devuelven { success, data } en algunos casos.
      const ordData = Array.isArray(ordersRes?.data) ? ordersRes.data : ordersRes;
      const cliData = Array.isArray(clientsRes?.data) ? clientsRes.data : clientsRes;
      const menData = Array.isArray(menuRes?.data) ? menuRes.data : menuRes;

      setOrders(ordData || []);
      setClients(cliData || []);
      setMenu(menData || []);
    } catch (e: any) {
      console.error(e);
      setError(e?.userMessage || 'Error cargando datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Métricas
  const totalOrders = orders.length;
  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0),
    [orders]
  );
  const totalClients = clients.length;
  const totalMenu = menu.length;

  const ordersByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    for (const o of orders) {
      map[o.status] = (map[o.status] || 0) + 1;
    }
    return Object.entries(map).map(([label, value]) => ({ label, value }));
  }, [orders]);

  const categoryStats = useMemo(() => {
    const map: Record<string, { name: string; count: number }> = {};
    for (const m of menu) {
      const key = m.category?.name || 'Sin categoría';
      if (!map[key]) map[key] = { name: key, count: 0 };
      map[key].count += 1;
    }
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [menu]);

  // Filtros locales por fecha (fallback si backend no filtra)
  const filteredOrders = useMemo(() => {
    let list = orders;
    if (startDate) list = list.filter((o) => new Date(o.created_at) >= new Date(startDate));
    if (endDate) list = list.filter((o) => new Date(o.created_at) <= new Date(endDate));
    if (status) list = list.filter((o) => o.status === status);
    return list;
  }, [orders, startDate, endDate, status]);

  // Exportar CSV (ejemplos)
  const exportOrdersCSV = () => {
    const rows = filteredOrders.map((o) => ({
      id: o.id,
      user_id: o.user_id,
      total_price: o.total_price,
      status: o.status,
      created_at: o.created_at,
    }));
    downloadFile('ordenes.csv', toCSV(rows), 'text/csv');
  };

  const exportClientsCSV = () => {
    const rows = clients.map((c) => ({ id: c.id, name: c.name, email: c.email, phone: c.phone }));
    downloadFile('clientes.csv', toCSV(rows), 'text/csv');
  };

  const exportMenuCSV = () => {
    const rows = menu.map((m) => ({ id: m.id, title: m.title, price: m.price, category: m.category?.name }));
    downloadFile('menu.csv', toCSV(rows), 'text/csv');
  };

  // Exportar a PDF: usamos impresión del navegador como fallback
  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Reportes</h1>
        <div className="flex gap-2">
          <button onClick={exportPDF} className="px-3 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800">Exportar PDF</button>
          <button onClick={exportOrdersCSV} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">CSV Órdenes</button>
          <button onClick={exportClientsCSV} className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500">CSV Clientes</button>
          <button onClick={exportMenuCSV} className="px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-500">CSV Menú</button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border rounded p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Desde</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full border rounded px-2 py-2" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Hasta</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full border rounded px-2 py-2" />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm mb-1">Estado</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border rounded px-2 py-2">
              <option value="">Todos</option>
              <option value="PENDING">Pendiente</option>
              <option value="PROCESSING">Procesando</option>
              <option value="COMPLETED">Completado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button onClick={fetchData} className="px-3 py-2 bg-neutral-900 text-white rounded hover:bg-neutral-800">Aplicar filtros</button>
            <button onClick={() => { setStartDate(''); setEndDate(''); setStatus(''); fetchData(); }} className="px-3 py-2 border rounded hover:bg-neutral-50">Limpiar</button>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-neutral-500">Órdenes</div>
          <div className="text-2xl font-semibold">{totalOrders}</div>
        </div>
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-neutral-500">Ingresos</div>
          <div className="text-2xl font-semibold">{formatCurrency(totalRevenue)}</div>
        </div>
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-neutral-500">Clientes</div>
          <div className="text-2xl font-semibold">{totalClients}</div>
        </div>
        <div className="bg-white border rounded p-4">
          <div className="text-sm text-neutral-500">Productos del Menú</div>
          <div className="text-2xl font-semibold">{totalMenu}</div>
        </div>
      </div>

      {/* Gráfico de estado de órdenes */}
      <div className="bg-white border rounded p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Órdenes por estado</h2>
          <span className="text-sm text-neutral-500">Periodo seleccionado</span>
        </div>
        <BarChart data={ordersByStatus} />
      </div>

      {/* Tabla de Órdenes */}
      <div className="bg-white border rounded p-4 mb-6 overflow-auto">
        <h2 className="text-lg font-semibold mb-3">Órdenes</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Cliente</th>
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Estado</th>
              <th className="text-right p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={5} className="p-3">Cargando...</td></tr>
            )}
            {!loading && filteredOrders.length === 0 && (
              <tr><td colSpan={5} className="p-3">Sin datos</td></tr>
            )}
            {!loading && filteredOrders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-neutral-50">
                <td className="p-2">{o.id}</td>
                <td className="p-2">{o.user_id}</td>
                <td className="p-2">{new Date(o.created_at).toLocaleString()}</td>
                <td className="p-2">{o.status}</td>
                <td className="p-2 text-right">{formatCurrency(Number(o.total_price))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white border rounded p-4 mb-6 overflow-auto">
        <h2 className="text-lg font-semibold mb-3">Clientes</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 && (
              <tr><td colSpan={4} className="p-3">Sin datos</td></tr>
            )}
            {clients.map((c) => (
              <tr key={c.id} className="border-b hover:bg-neutral-50">
                <td className="p-2">{c.id}</td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.phone || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabla de Menú */}
      <div className="bg-white border rounded p-4 mb-6 overflow-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Menú</h2>
          <span className="text-sm text-neutral-500">Por categoría</span>
        </div>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Título</th>
              <th className="text-left p-2">Categoría</th>
              <th className="text-right p-2">Precio</th>
              <th className="text-left p-2">Disponible</th>
            </tr>
          </thead>
          <tbody>
            {menu.length === 0 && (
              <tr><td colSpan={5} className="p-3">Sin datos</td></tr>
            )}
            {menu.map((m) => (
              <tr key={m.id} className="border-b hover:bg-neutral-50">
                <td className="p-2">{m.id}</td>
                <td className="p-2">{m.title}</td>
                <td className="p-2">{m.category?.name || '-'}</td>
                <td className="p-2 text-right">{formatCurrency(Number(m.price))}</td>
                <td className="p-2">{m.isAvailable ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen de Categorías */}
      <div className="bg-white border rounded p-4">
        <h2 className="text-lg font-semibold mb-3">Categorias (conteo)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {categoryStats.map((c) => (
            <div key={c.name} className="border rounded p-3">
              <div className="text-sm text-neutral-500">{c.name}</div>
              <div className="text-xl font-semibold">{c.count}</div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-600">{error}</div>
      )}
    </div>
  );
}