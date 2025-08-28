import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, loginAsClient, loginAsAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (error: unknown) {
      console.error('Error inesperado en login:', error);
      setError('Error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleClientLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loginAsClient(email, password);
      
      if (result.success) {
        navigate('/client');
      } else {
        setError(result.error || 'Error al iniciar sesión como cliente');
      }
    } catch (error: unknown) {
      console.error('Error inesperado en login de cliente:', error);
      setError('Error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await loginAsAdmin(email, password);
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Error al iniciar sesión como administrador');
      }
    } catch (error: unknown) {
      console.error('Error inesperado en login de admin:', error);
      setError('Error inesperado. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-gray-600">
            Accede a tu cuenta para gestionar tus pedidos
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <span>⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand)] focus:border-transparent transition-all duration-200 pl-12"
                  placeholder="tu@email.com"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">📧</span>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand)] focus:border-transparent transition-all duration-200 pl-12 pr-12"
                  placeholder="Tu contraseña"
                  disabled={loading}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-lg">🔒</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={loading}
                >
                  <span className="text-lg">{showPassword ? "🙈" : "👁️"}</span>
                </button>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="space-y-3">
              {/* Login General */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[color:var(--brand)] hover:bg-[color:var(--brand-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--brand)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Iniciar Sesión
                  </>
                )}
              </button>
              
              {/* Separador */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o inicia sesión como</span>
                </div>
              </div>
              
              {/* Botones específicos */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleClientLogin}
                  disabled={loading || !email || !password}
                  className="flex justify-center items-center gap-2 py-3 px-4 border border-blue-300 rounded-lg shadow-sm text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <span>👤</span>
                  Cliente
                </button>
                
                <button
                  type="button"
                  onClick={handleAdminLogin}
                  disabled={loading || !email || !password}
                  className="flex justify-center items-center gap-2 py-3 px-4 border border-purple-300 rounded-lg shadow-sm text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  <span>👨‍💼</span>
                  Admin
                </button>
              </div>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
              <span>ℹ️</span>
              Credenciales de Prueba
            </h3>
            <div className="text-sm text-blue-700 space-y-2">
              <div>
                <p><strong>Cliente:</strong></p>
                <p>Email: cliente@toritogrill.com | Contraseña: cliente123</p>
              </div>
              <div>
                <p><strong>Admin:</strong></p>
                <p>Email: admin@toritogrill.com | Contraseña: admin123</p>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                * Cualquier email/contraseña funciona en modo demo
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <a href="#" className="font-medium text-[color:var(--brand)] hover:text-[color:var(--brand-dark)] transition-colors">
                Regístrate aquí
              </a>
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
    </div>
  );
}