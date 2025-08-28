export default function ClientFooter() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo y descripción */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🐂</span>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-wide">Resto BarX</span>
                <span className="text-xs text-orange-400 font-medium">Sabor Auténtico</span>
              </div>
            </div>
            <p className="text-gray-300 text-sm">
              La mejor experiencia gastronómica con auténticos sabores peruanos.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/client" className="text-gray-300 hover:text-orange-400 transition-colors">Inicio</a></li>
              <li><a href="/client/menu" className="text-gray-300 hover:text-orange-400 transition-colors">Menú</a></li>
              <li><a href="/client/orders" className="text-gray-300 hover:text-orange-400 transition-colors">Mis Pedidos</a></li>
              <li><a href="/client/profile" className="text-gray-300 hover:text-orange-400 transition-colors">Mi Perfil</a></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contacto</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>📍 Av. Principal 123, Lima</p>
              <p>📞 +51 999 888 777</p>
              <p>✉️ info@restobarx.com</p>
              <p>🕒 Lun - Dom: 11:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Resto BarX. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}