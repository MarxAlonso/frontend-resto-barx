export default function ContactSection() {
  return (
    <section id="contacto" className="bg-gray-50 py-16 md:py-20">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Visítanos
          </h2>
          <p className="text-lg text-gray-600">
            Te esperamos en nuestro acogedor restaurante para brindarte la mejor experiencia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-600">
                Av. Principal 123<br />
                Lima, Perú
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🕒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Horarios</h3>
              <p className="text-gray-600">
                Lun - Dom<br />
                12:00 PM - 11:00 PM
              </p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Contacto</h3>
              <p className="text-gray-600">
                +51 923 456 789<br />
                info@restobarx.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}