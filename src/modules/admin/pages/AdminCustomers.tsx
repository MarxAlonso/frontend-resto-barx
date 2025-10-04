import { useState, useEffect } from 'react';
import { userAPI } from '../../../services/api'; // importando el api

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<'all' | 'active' | 'inactive'>('all');

  const statusOptions: { id: 'all' | 'active' | 'inactive'; name: string }[] = [
    { id: 'all', name: 'Todos' },
    { id: 'active', name: 'Activos' },
    { id: 'inactive', name: 'Inactivos' },
  ];
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '', // solo para crear
    isActive: true,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await userAPI.getClients();
        /*setCustomers(
          data.map((u: Customer) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || '',
            isActive: u.isActive,
            createdAt: u.createdAt,
          }))
        );*/
        setCustomers(
          data.map((u: any) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: u.phone || '',
            isActive: u.is_active,
            createdAt: u.created_at,
          }))
        );
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la lista de clientes');
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.includes(searchTerm)) &&
      (statusFilter === 'all' ||
        (statusFilter === 'active' && c.isActive) ||
        (statusFilter === 'inactive' && !c.isActive))
  );

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      password: '',
      isActive: customer.isActive,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (customerId: number) => {
    if (confirm('¿Eliminar este cliente?')) {
      await userAPI.deleteClient(customerId);
      /*setCustomers((prev) => prev.map((c) => (c.id === editingCustomer.id ? { ...c, ...updated } : c)));*/

      setCustomers((prev) => prev.filter((c) => c.id !== customerId));
    }
  };

  const handleSelectCustomer = (customerId: number) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map((c) => c.id));
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        // actualizar
        const updated = await userAPI.updateProfile(editingCustomer.id, {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          isActive: formData.isActive,
        });
        setCustomers((prev) =>
          prev.map((c) => c.id === editingCustomer.id ? { ...c, ...updated.data } : c)
        );
      } else {
        // crear
        const created = await userAPI.createClient({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });
        setCustomers((prev) => [...prev, created]);
      }
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
      alert('Error al guardar cliente');
    }
  };

  const getStatusColor = (active: boolean) =>
    active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const getStatusText = (active: boolean) => (active ? 'Activo' : 'Inactivo');

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.isActive).length,
    inactive: customers.filter((c) => !c.isActive).length,
  };

  if (loading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Gestión de Clientes</h2>
        <p className="opacity-90">Administra los perfiles y datos de tus clientes</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
              <p className="text-3xl font-bold text-purple-600">S/ 0</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Promedio</p>
              <p className="text-3xl font-bold text-orange-600">S/ 0</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setEditingCustomer(null);
              setShowAddModal(true);
            }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            <span>➕</span>
            Agregar Cliente
          </button>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          {statusOptions.map(status => (
            <button
              key={status.id}
              onClick={() => setStatusFilter(status.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === status.id
                  ? 'bg-blue-100 text-blue-700 border border-blue-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.name}
            </button>
          ))}
        </div>

        {/* Bulk Actions */}
        {selectedCustomers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedCustomers.length} cliente(s) seleccionado(s)
              </span>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                  Activar
                </button>
                <button className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">
                  Desactivar
                </button>
                <button className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600">
                  Bloquear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedCustomers.length === filteredCustomers.length &&
                      filteredCustomers.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-6 py-3 text-left">Cliente</th>
                <th className="px-6 py-3 text-left">Contacto</th>
                <th className="px-6 py-3 text-left">Registro</th>
                <th className="px-6 py-3 text-left">Estado</th>
                <th className="px-6 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(c.id)}
                      onChange={() => handleSelectCustomer(c.id)}
                    />
                  </td>
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4">
                    {c.email}
                    <br />
                    {c.phone}
                  </td>
                  <td className="px-6 py-4">{formatDate(c.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        c.isActive
                      )}`}
                    >
                      {getStatusText(c.isActive)}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Agregar/Editar */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <h3 className="text-lg font-semibold">
                {editingCustomer ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
              </h3>

              <input
                className="w-full border p-2 rounded"
                placeholder="Nombre"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <input
                className="w-full border p-2 rounded"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {!editingCustomer && (
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Contraseña"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              )}
              <select
                className="w-full border p-2 rounded"
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isActive: e.target.value === 'active',
                  })
                }
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 border p-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white p-2 rounded"
                >
                  {editingCustomer ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}