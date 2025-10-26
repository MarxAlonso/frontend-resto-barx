import type { MenuItem } from "../../../../services/api";

/**
 * 🔹 Props para el control de filtros y acciones del menú
 * Se reciben desde el componente padre (AdminMenu), por lo que este
 * componente es totalmente reutilizable y NO maneja el estado.
 */
interface MenuControlsProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  isAdmin: boolean;
  setShowAddModal: (value: boolean) => void;
  setEditingItem: (item: MenuItem | null) => void;
  categories: { id: string | number; name: string; icon?: string }[];
}

/**
 * 📦 Componente UI para Search + Filtro por Categorías + Botón Agregar
 */
export default function MenuControls({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  isAdmin,
  setShowAddModal,
  setEditingItem,
  categories
}: MenuControlsProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      
      {/* 📝 Input de búsqueda */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
            <input
              type="text"
              placeholder="Buscar platos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* ➕ Botón Agregar Plato (solo Admin) */}
        {isAdmin && (
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
        )}
      </div>

      {/* 📌 Filtro por categorías */}
      <div className="flex flex-wrap gap-2 mt-4">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id.toString())}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category.id
                ? "bg-orange-100 text-orange-700 border border-orange-300"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span>{category.icon}</span>
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
}
