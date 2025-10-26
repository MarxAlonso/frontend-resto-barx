import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const HomePage = lazy(() => import("./pages/HomePage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Client
const ClientLayout = lazy(() => import("./modules/client/layouts/ClientLayout"));
const ClientHome = lazy(() => import("./modules/client/pages/ClientHome"));
const ClientMenu = lazy(() => import("./modules/client/pages/ClientMenu"));
const ClientOrders = lazy(() => import("./modules/client/pages/ClientOrders"));
const ClientProfile = lazy(() => import("./modules/client/pages/ClientProfile"));

// Admin
const AdminLayout = lazy(() => import("./modules/admin/layouts/AdminLayout"));
const AdminDashboard = lazy(() => import("./modules/admin/pages/AdminDashboard"));
const AdminOrders = lazy(() => import("./modules/admin/pages/AdminOrders"));
const AdminMenu = lazy(() => import("./modules/admin/pages/AdminMenu"));
const AdminCustomers = lazy(() => import("./modules/admin/pages/AdminCustomers"));
const AdminReportes = lazy(() => import("./modules/admin/pages/AdminReportes"));

// Componente para mostrar Home o redirigir según autenticación
function HomeOrRedirect() {
  const { isAuthenticated, isClient, isAdmin } = useAuth();

  // Si no está autenticado, mostrar la página Home como informativa
  if (!isAuthenticated()) {
    return <HomePage />;
  }

  // Si está autenticado, redirigir según el rol
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
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
          </div>
        }
      >
        <Routes>
          {/* Ruta raíz - Home informativo o redirección según autenticación */}
          <Route path="/" element={<HomeOrRedirect />} />
          
          {/* Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Register */}
          <Route path="/register" element={<Register />} />
          
          {/* Rutas del Cliente */}
          <Route path="/client" element={
            <ProtectedRoute requiredRole="CLIENT">
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
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reportes" element={<AdminReportes />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
