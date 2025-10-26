import { Link } from "react-router-dom";

/**
 * Componente QuickActions
 * Muestra accesos rápidos para acciones comunes del panel de administración
 * 
 * Mejora la usabilidad al permitir realizar tareas frecuentes en un clic.
 * Usa estilos con TailwindCSS y hover para una interfaz fluida y moderna.
 */
export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">

          {/* Acción 1: Agregar Plato */}
          <Link
            to="/admin/menu"
            className="bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">🍽️</div>
            <div className="text-sm font-medium text-green-900">Agregar Plato</div>
          </Link>

          {/* Acción 2: Nuevo Cliente */}
          <Link
            to="/admin/customers"
            className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-center transition-colors"
          >
            <div className="text-2xl mb-2">👤</div>
            <div className="text-sm font-medium text-purple-900">Nuevo Cliente</div>
          </Link>

          {/* Acción 3: Ver Reportes */}
          <Link
            to="/admin/reportes"
            className="bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg p-4 text-center transition-colors col-span-2"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-orange-900">Ver Reportes</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
