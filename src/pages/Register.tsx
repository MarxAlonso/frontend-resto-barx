import { Link, useLocation } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

export default function Register() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3 mb-6 hover:opacity-80 transition-opacity">
            <span className="text-4xl">🐂</span>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-wide text-gray-900">Resto BarX</span>
              <span className="text-sm text-gray-500 -mt-1">Parrilla Peruana</span>
            </div>
          </Link>
        </div>

        {/* Success Message (if coming from successful registration) */}
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
            <div className="flex items-center gap-2">
              <span>✅</span>
              {message}
            </div>
          </div>
        )}

        {/* Register Form */}
        <RegisterForm />

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link 
              to="/login" 
              className="font-medium text-[color:var(--brand)] hover:text-[color:var(--brand-dark)] transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
          <Link 
            to="/" 
            className="inline-block mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}