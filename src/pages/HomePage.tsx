import { useState } from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";
import ContactSection from "./HomePage/components/ContactSection"
import MenuSection from "./HomePage/components/MenuSection"
import AboutSection from "./HomePage/components/AboutSection"
import HeroSection from "./HomePage/components/HeroSection"
import FooterSection from "./HomePage/components/FooterSection"
import FeaturesSection from "./HomePage/components/FeaturesSection"

export default function HomePage() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleRegisterSuccess = () => {
    setShowRegisterForm(false);
    // Mostrar un mensaje de éxito o redirigir
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Header/Navigation */}
      <header className="bg-white shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-4xl">🐂</span>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-wide text-gray-900">Resto BarX</span>
                <span className="text-sm text-gray-500 -mt-1">Parrilla Peruana</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link 
                to="/login" 
                className="text-gray-600 hover:text-orange-600 transition-colors font-medium"
              >
                Iniciar Sesión
              </Link>
              <button
                onClick={() => setShowRegisterForm(true)}
                className="cursor-pointer bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Registrarse
              </button>
            </nav>
          </div>
        </div>
      </header>
      <HeroSection />
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Sabores Auténticos de la
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  {" "}Parrilla Peruana
                </span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                Descubre la mejor experiencia gastronómica con nuestros platos tradicionales 
                preparados con ingredientes frescos y el auténtico sabor peruano.
              </p>
            </div>

            {/* Features */}
            <FeaturesSection />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowRegisterForm(true)}
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🎉</span>
                Crear Cuenta Gratis
              </button>
              <Link
                to="/login"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>🚀</span>
                Ya tengo cuenta
              </Link>
            </div>
          </div>

          {/* Right Column - Image/Visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-200 to-amber-200 rounded-3xl p-8 shadow-2xl">
              <div className="text-center space-y-6">
                <div className="text-8xl">🥩</div>
                <h3 className="text-2xl font-bold text-gray-800">¡Deliciosos Platos!</h3>
                <p className="text-gray-600">
                  Anticuchos, Parrilladas, Lomo Saltado y mucho más
                </p>
                
                {/* Sample Menu Items */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="text-3xl mb-2">🍖</div>
                    <h4 className="font-semibold text-gray-800">Anticuchos</h4>
                    <p className="text-orange-600 font-bold">S/ 25.00</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="text-3xl mb-2">🥘</div>
                    <h4 className="font-semibold text-gray-800">Lomo Saltado</h4>
                    <p className="text-orange-600 font-bold">S/ 32.00</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="text-3xl mb-2">🍗</div>
                    <h4 className="font-semibold text-gray-800">Pollo a la Brasa</h4>
                    <p className="text-orange-600 font-bold">S/ 28.00</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md">
                    <div className="text-3xl mb-2">🥩</div>
                    <h4 className="font-semibold text-gray-800">Parrillada</h4>
                    <p className="text-orange-600 font-bold">S/ 45.00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600">500+</div>
            <div className="text-gray-600 mt-2">Clientes Satisfechos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600">50+</div>
            <div className="text-gray-600 mt-2">Platos Únicos</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600">4.8</div>
            <div className="text-gray-600 mt-2">Rating Promedio</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600">24/7</div>
            <div className="text-gray-600 mt-2">Servicio Disponible</div>
          </div>
        </div>
      </main>

      {/* Register Modal */}
      {showRegisterForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full max-h-[90vh] overflow-y-auto">
            <RegisterForm 
              onSuccess={handleRegisterSuccess}
              onCancel={() => setShowRegisterForm(false)}
            />
          </div>
        </div>
      )}
      <AboutSection />
      <MenuSection />
      <ContactSection />
      {/* Footer */}
      <FooterSection />
    </div>
  );
}