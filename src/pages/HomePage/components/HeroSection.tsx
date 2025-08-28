export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-orange-50 to-orange-100 py-16 md:py-24">
      <div className="container-page text-center">
        <div className="fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenido a <span className="text-[color:var(--brand)]">Resto BarX</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Disfruta de la mejor parrilla peruana con sabores auténticos y ingredientes frescos. 
            Una experiencia gastronómica única te espera.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#menu" 
              className="btn-primary inline-block text-center"
            >
              Ver Menú
            </a>
            <a 
              href="#contacto" 
              className="btn-secondary inline-block text-center"
            >
              Reservar Mesa
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}