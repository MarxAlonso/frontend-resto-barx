import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  {
    path: '/admin',
    icon: '📊',
    label: 'Dashboard',
    exact: true
  },
  {
    path: '/admin/orders',
    icon: '📋',
    label: 'Pedidos'
  },
  {
    path: '/admin/menu',
    icon: '🍽️',
    label: 'Menú'
  },
  {
    path: '/admin/customers',
    icon: '👥',
    label: 'Clientes'
  },
  {
    path: '/admin/reports',
    icon: '📈',
    label: 'Reportes'
  },
  {
    path: '/admin/settings',
    icon: '⚙️',
    label: 'Configuración'
  }
];

export default function AdminSidebar() {
  const location = useLocation();

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/admin" className="flex items-center gap-3">
          <span className="text-3xl">🐂</span>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-wide">Resto BarX</span>
            <span className="text-xs text-orange-400 font-medium">Panel Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path, item.exact)
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 text-center">
          <p>© 2024 Torito Grill</p>
          <p>Panel de Administración</p>
        </div>
      </div>
    </div>
  );
}