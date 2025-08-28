import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();

  const base = "px-4 py-2 rounded-lg hover:bg-orange-50 md:hover:bg-transparent transition-colors duration-200";
  const active = ({ isActive }: { isActive: boolean }) =>
    isActive ? base + " font-semibold text-[color:var(--brand)]" : base;

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-200 shadow-sm">
      <nav className="container-page flex items-center justify-between gap-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <span className="text-3xl">🐂</span>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-wide text-gray-900">Resto BarX</span>
            <span className="text-xs text-gray-500 -mt-1">Parrilla Peruana</span>
          </div>
        </Link>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
        >
          <svg 
            className={`w-6 h-6 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex items-center gap-2">
          <li>
            <a href="#menu" className={base + " hover:text-[color:var(--brand)]"} onClick={() => setOpen(false)}>
              Menú
            </a>
          </li>
          <li>
            <a href="#contacto" className={base + " hover:text-[color:var(--brand)]"} onClick={() => setOpen(false)}>
              Contacto
            </a>
          </li>
          {!isAuthenticated ? (
            <li>
              <NavLink to="/login" className={active}>
                Ingresar
              </NavLink>
            </li>
          ) : (
            <li className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                Hola, <span className="font-semibold text-gray-900">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Salir
              </button>
            </li>
          )}
        </ul>

        {/* Mobile menu */}
        <div className={`absolute top-full left-0 right-0 md:hidden bg-white border-b border-gray-200 shadow-lg transition-all duration-300 ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <ul className="container-page py-4 space-y-2">
            <li>
              <a 
                href="#menu" 
                className={base + " block hover:text-[color:var(--brand)]"} 
                onClick={() => setOpen(false)}
              >
                🍽️ Menú
              </a>
            </li>
            <li>
              <a 
                href="#contacto" 
                className={base + " block hover:text-[color:var(--brand)]"} 
                onClick={() => setOpen(false)}
              >
                📍 Contacto
              </a>
            </li>
            {!isAuthenticated ? (
              <li>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `${base} block ${isActive ? 'font-semibold text-[color:var(--brand)]' : ''}`
                  }
                  onClick={() => setOpen(false)}
                >
                  🔐 Ingresar
                </NavLink>
              </li>
            ) : (
              <>
                <li className="px-4 py-2 border-t border-gray-100 mt-2 pt-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Hola, <span className="font-semibold text-gray-900">{user?.name}</span>
                  </div>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🚪 Cerrar Sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}