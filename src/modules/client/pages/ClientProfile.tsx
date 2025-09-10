import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { userAPI } from '../../../services/api';

export default function ClientProfile() {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      if (!user) return;
      const updated = await userAPI.updateProfile(user.id, {
        name: formData.name,
        phone: formData.phone
      });

      setUser(updated); // refresca el contexto
      setIsEditing(false);
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      alert("No se pudo actualizar el perfil");
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Mi Perfil</h1>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Nombre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre Completo
          </label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          ) : (
            <p className="text-gray-900">{formData.name}</p>
          )}
        </div>

        {/* Email (solo lectura) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Correo Electrónico
          </label>
          <p className="text-gray-900">{formData.email}</p>
        </div>

        {/* Teléfono */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teléfono
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          ) : (
            <p className="text-gray-900">{formData.phone}</p>
          )}
        </div>

        {/* Botones */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
          >
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Guardar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
