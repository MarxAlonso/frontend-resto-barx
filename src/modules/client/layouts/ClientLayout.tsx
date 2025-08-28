import { Outlet } from 'react-router-dom';
import ClientNavbar from '../components/ClientNavbar';
import ClientFooter from '../components/ClientFooter';

export default function ClientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ClientNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ClientFooter />
    </div>
  );
}