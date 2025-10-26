import type { MenuItem } from "../../../../services/api";

/**
 * 🔹 Componente MenuStats
 * Muestra estadísticas del menú: total, disponibles, no disponibles y precio promedio.
 * 
 * ✅ Buenas prácticas:
 * - Es un componente puro (sin estado local ni efectos).
 * - Recibe `menuItems` como prop, lo que facilita la reutilización y las pruebas.
 * - Evita cálculos innecesarios (usa variables locales en lugar de cálculos repetidos).
 */
interface MenuStatsProps {
  menuItems: MenuItem[];
}

export default function MenuStats({ menuItems }: MenuStatsProps) {
  // ⚙️ Cálculos optimizados
  const totalItems = menuItems.length;
  const availableItems = menuItems.filter((item) => item.isAvailable).length;
  const unavailableItems = totalItems - availableItems;
  const averagePrice =
    totalItems > 0
      ? (menuItems.reduce((sum, item) => sum + item.price, 0) / totalItems).toFixed(2)
      : "0.00";

  // 🎨 Retorno del componente UI
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total de platos */}
      <StatCard
        icon="🍽️"
        bgColor="bg-blue-100"
        title="Total Platos"
        value={totalItems.toString()}
        valueColor="text-gray-900"
      />

      {/* Disponibles */}
      <StatCard
        icon="✅"
        bgColor="bg-green-100"
        title="Disponibles"
        value={availableItems.toString()}
        valueColor="text-green-600"
      />

      {/* No disponibles */}
      <StatCard
        icon="❌"
        bgColor="bg-red-100"
        title="No Disponibles"
        value={unavailableItems.toString()}
        valueColor="text-red-600"
      />

      {/* Precio Promedio */}
      <StatCard
        icon="💰"
        bgColor="bg-yellow-100"
        title="Precio Promedio"
        value={`S/ ${averagePrice}`}
        valueColor="text-yellow-600"
      />
    </div>
  );
}

/**
 * 🔸 Componente interno para cada tarjeta de estadística.
 * Mejora la legibilidad y evita repetir el mismo código 4 veces.
 */
interface StatCardProps {
  icon: string;
  bgColor: string;
  title: string;
  value: string;
  valueColor: string;
}

function StatCard({ icon, bgColor, title, value, valueColor }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}>
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={`text-xl font-bold ${valueColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}
