import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  preparationTime: number;
}

export default function AdminMenu() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Mock data - en producción vendría del backend
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: '1',
      name: 'Anticucho de Corazón',
      description: 'Brochetas de corazón de res marinadas con ají panca y especias peruanas',
      price: 25.90,
      category: 'parrilla',
      image: '🥩',
      available: true,
      preparationTime: 15
    },
    {
      id: '2',
      name: 'Parrilla Mixta',
      description: 'Combinación de carnes: anticuchos, chorizo, mollejitas y papa rellena',
      price: 45.90,
      category: 'parrilla',
      image: '🍖',
      available: true,
      preparationTime: 20
    },
    {
      id: '3',
      name: 'Pollo a la Brasa',
      description: 'Pollo entero marinado con especias secretas, acompañado de papas y ensalada',
      price: 28.90,
      category: 'pollo',
      image: '🍗',
      available: true,
      preparationTime: 25
    },
    {
      id: '4',
      name: 'Lomo Saltado',
      description: 'Tiras de lomo saltadas con cebolla, tomate y papas fritas',
      price: 32.90,
      category: 'platos',
      image: '🥘',
      available: false,
      preparationTime: 12
    },
    {
      id: '5',
      name: 'Inca Kola',
      description: 'Bebida gaseosa peruana de 500ml',
      price: 4.50,
      category: 'bebidas',
      image: '🥤',
      available: true,
      preparationTime: 1
    },
    {
      id: '6',
      name: 'Chicha Morada',
      description: 'Bebida tradicional peruana hecha con maíz morado',
      price: 6.90,
      category: 'bebidas',
      image: '🍷',
      available: true,
      preparationTime: 2
    }
  ]);

  const categories = [
    { id: 'all', name: 'Todos', icon: '🍽️' },
    { id: 'parrilla', name: 'Parrilla', icon: '🥩' },
    { id: 'pollo', name: 'Pollo', icon: '🍗' },
    { id: 'platos', name: 'Platos', icon: '🥘' },
    { id: 'bebidas', name: 'Bebidas', icon: '🥤' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleAvailability = (id: string) => {
    setMenuItems(items =>
      items.map(item =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este plato?')) {
      setMenuItems(items => items.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-2">Gestión del Menú</h2>
        <p className="opacity-90">Administra los platos y bebidas de tu restaurante</p>
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
                placeholder="Buscar platos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setEditingItem(null);
              setShowAddModal(true);
            }}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            <span>➕</span>
            Agregar Plato
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-orange-100 text-orange-700 border border-orange-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">🍽️</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Platos</p>
              <p className="text-xl font-bold text-gray-900">{menuItems.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-xl font-bold text-green-600">{menuItems.filter(item => item.available).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">❌</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">No Disponibles</p>
              <p className="text-xl font-bold text-red-600">{menuItems.filter(item => !item.available).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Precio Promedio</p>
              <p className="text-xl font-bold text-yellow-600">
                S/ {(menuItems.reduce((sum, item) => sum + item.price, 0) / menuItems.length).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-2xl">
                    {item.image}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{item.category}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.available 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.available ? 'Disponible' : 'No disponible'}
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>

              {/* Price and Time */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-orange-600">S/ {item.price.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <span>⏱️</span>
                    {item.preparationTime} min
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAvailability(item.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.available
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                  }`}
                >
                  {item.available ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => handleEdit(item)}
                  className="px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium transition-colors"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron platos</h3>
          <p className="text-gray-600">Intenta cambiar los filtros o agregar un nuevo plato</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingItem ? 'Editar Plato' : 'Agregar Nuevo Plato'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    defaultValue={editingItem?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Nombre del plato"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    defaultValue={editingItem?.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Descripción del plato"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio (S/)</label>
                    <input
                      type="number"
                      step="0.10"
                      defaultValue={editingItem?.price || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo (min)</label>
                    <input
                      type="number"
                      defaultValue={editingItem?.preparationTime || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="15"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select
                    defaultValue={editingItem?.category || 'platos'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="parrilla">Parrilla</option>
                    <option value="pollo">Pollo</option>
                    <option value="platos">Platos</option>
                    <option value="bebidas">Bebidas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Emoji/Icono</label>
                  <input
                    type="text"
                    defaultValue={editingItem?.image || '🍽️'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="🍽️"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors"
                  >
                    {editingItem ? 'Actualizar' : 'Agregar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}