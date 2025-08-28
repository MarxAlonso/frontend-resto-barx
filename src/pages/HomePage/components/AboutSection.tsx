export default function AboutSection() {
  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-page">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nuestra Historia
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Desde hace más de 20 años, Resto BarX ha sido sinónimo de excelencia 
              en la parrilla peruana. Nuestro compromiso con la calidad y el sabor 
              auténtico nos ha convertido en el lugar favorito de las familias.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              Cada plato es preparado con ingredientes frescos y técnicas tradicionales 
              que han pasado de generación en generación, garantizando una experiencia 
              gastronómica inolvidable.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-[color:var(--brand)] mb-2">20+</div>
                <div className="text-gray-600">Años de experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[color:var(--brand)] mb-2">1000+</div>
                <div className="text-gray-600">Clientes satisfechos</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8 text-center">
              <div className="text-8xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Parrilla Tradicional
              </h3>
              <p className="text-gray-600">
                Cocinamos con carbón de algarrobo para obtener ese sabor único 
                que caracteriza a la auténtica parrilla peruana.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}