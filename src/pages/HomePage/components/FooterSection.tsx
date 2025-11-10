export default function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🐂</span>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl tracking-wide">Resto BarX</span>
                  <span className="text-sm text-gray-400 -mt-1">Parrilla Peruana</span>
                </div>
              </div>
              <p className="text-gray-400">
                La mejor experiencia gastronómica peruana con sabores auténticos y tradición familiar.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <p>📍 Av. Principal 123, Lima, Perú</p>
                <p>📞 +51 999 999 999</p>
                <p>📧 info@restobarx.com</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Horarios</h3>
              <div className="space-y-2 text-gray-400">
                <p>Lunes - Viernes: 11:00 AM - 11:00 PM</p>
                <p>Sábados: 12:00 PM - 12:00 AM</p>
                <p>Domingos: 12:00 PM - 10:00 PM</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Resto BarX. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
  );
}