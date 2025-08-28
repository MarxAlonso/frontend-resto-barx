import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Client imports
import ClientLayout from "./modules/client/layouts/ClientLayout";
import { ClientHome, ClientMenu, ClientOrders, ClientProfile } from "./modules/client/pages";

// Admin imports
import AdminLayout from "./modules/admin/layouts/AdminLayout";
import { AdminDashboard, AdminOrders } from "./modules/admin/pages";

// Componente para redirección automática basada en rol
function RoleBasedRedirect() {
  const { isAuthenticated, isClient, isAdmin } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (isClient()) {
    return <Navigate to="/client" replace />;
  }

  if (isAdmin()) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Routes>
          {/* Ruta raíz - redirige según el rol */}
          <Route path="/" element={<RoleBasedRedirect />} />
          
          {/* Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Rutas del Cliente */}
          <Route path="/client" element={
            <ProtectedRoute requiredRole="client">
              <ClientLayout />
            </ProtectedRoute>
          }>
            <Route index element={<ClientHome />} />
            <Route path="menu" element={<ClientMenu />} />
            <Route path="orders" element={<ClientOrders />} />
            <Route path="profile" element={<ClientProfile />} />
          </Route>
          
          {/* Rutas del Admin */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}
