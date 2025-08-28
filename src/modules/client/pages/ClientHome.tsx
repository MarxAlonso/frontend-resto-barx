import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

export default function ClientHome() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            ¡Bienvenido {user?.name}!
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Disfruta de los mejores sabores peruanos desde la comodidad de tu hogar
          </p>
          <Link
            to="/client/menu"
            className="inline-block bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Ver Menú 🍽️
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            ¿Qué te gustaría hacer hoy?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ver Menú */}
            <Link
              to="/client/menu"
              className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-orange-200 group"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Explorar Menú</h3>
                <p className="text-gray-600">Descubre nuestros deliciosos platos peruanos</p>
              </div>
            </Link>

            {/* Mis Pedidos */}
            <Link
              to="/client/orders"
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-blue-200 group"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mis Pedidos</h3>
                <p className="text-gray-600">Revisa el estado de tus pedidos</p>
              </div>
            </Link>

            {/* Mi Perfil */}
            <Link
              to="/client/profile"
              className="bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-xl hover:shadow-lg transition-all duration-300 border border-green-200 group"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👤</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Mi Perfil</h3>
                <p className="text-gray-600">Actualiza tu información personal</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Platos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-6xl">🥩</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Anticucho de Corazón</h3>
                <p className="text-gray-600 mb-4">Brochetas marinadas en ají panca</p>
                <p className="text-2xl font-bold text-orange-600">S/ 25.90</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                <span className="text-6xl">🍖</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Parrilla Mixta</h3>
                <p className="text-gray-600 mb-4">Selección de carnes para 2 personas</p>
                <p className="text-2xl font-bold text-orange-600">S/ 45.90</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-red-400 to-pink-500 flex items-center justify-center">
                <span className="text-6xl">🍗</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Pollo a la Brasa</h3>
                <p className="text-gray-600 mb-4">Medio pollo con especias secretas</p>
                <p className="text-2xl font-bold text-orange-600">S/ 28.90</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}