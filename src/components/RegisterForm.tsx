import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

interface RegisterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function RegisterForm({ onSuccess, onCancel }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Por favor, ingresa tu nombre completo');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Por favor, ingresa tu correo electrónico');
      return false;
    }
    if (!formData.password) {
      setError('Por favor, ingresa una contraseña');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, ingresa un correo electrónico válido');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      // Registrar usuario con rol CLIENT automáticamente
      const response = await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });


      console.log('Usuario registrado exitosamente:', response);
      
      setSuccess(true);
      
      // Mostrar mensaje de éxito por 2 segundos y luego redirigir
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/login', { 
            state: { 
              message: '¡Registro exitoso! Ahora puedes iniciar sesión con tus credenciales.',
              email: formData.email 
            }
          });
        }
      }, 2000);

    } catch (error: any) {
      console.error('Error en registro:', error);
      
      // Usar el mensaje de error personalizado del interceptor si está disponible
      if (error.userMessage) {
        setError(error.userMessage);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 409) {
        setError('Este correo electrónico ya está registrado. Intenta con otro o inicia sesión.');
      } else {
        setError('Error al registrar usuario. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h3>
          <p className="text-gray-600 mb-4">
            Tu cuenta ha sido creada correctamente. Serás redirigido al login en unos segundos...
          </p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Crear Cuenta
        </h2>
        <p className="text-gray-600">
          Únete a Resto BarX y disfruta de nuestros deliciosos platos
        </p>
      </div>

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

        {/* Nombre Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre Completo
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand)] focus:border-transparent transition-all duration-200 pl-12"
              placeholder="Tu nombre completo"
              disabled={loading}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-lg">👤</span>
            </div>
          </div>
        </div>

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
              value={formData.email}
              onChange={handleInputChange}
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
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand)] focus:border-transparent transition-all duration-200 pl-12 pr-12"
              placeholder="Mínimo 6 caracteres"
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

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[color:var(--brand)] focus:border-transparent transition-all duration-200 pl-12 pr-12"
              placeholder="Repite tu contraseña"
              disabled={loading}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 text-lg">🔐</span>
            </div>
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              disabled={loading}
            >
              <span className="text-lg">{showConfirmPassword ? "🙈" : "👁️"}</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !formData.name || !formData.email || !formData.password || !formData.confirmPassword}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-[color:var(--brand)] hover:bg-[color:var(--brand-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--brand)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Creando cuenta...
            </>
          ) : (
            <>
              <span>🎉</span>
              Crear Cuenta
            </>
          )}
        </button>

        {/* Cancel Button (if provided) */}
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <span className="text-blue-500 text-lg">ℹ️</span>
          <div className="text-sm text-blue-700">
            <p className="font-medium mb-1">Al registrarte:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Tu cuenta será creada automáticamente.</li>
              <li>Podrás realizar pedidos y gestionar tu perfil</li>
              <li>Recibirás notificaciones sobre el estado de tus pedidos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}