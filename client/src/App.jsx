import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';
import AdminDashboardPage from './pages/AdminDashboardPage';
import LoginPage from './pages/LoginPage';
import MyBookingsPage from './pages/MyBookingsPage';
import SchedulePage from './pages/SchedulePage';
import './styles.css';

function AuthenticatedLayout() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <><Navbar /><Routes>
    <Route path="/" element={<SchedulePage />} />
    <Route path="/my-bookings" element={user.role === 'manager' ? <Navigate to="/admin" replace /> : <MyBookingsPage />} />
    <Route path="/admin" element={user.role === 'manager' ? <AdminDashboardPage /> : <Navigate to="/" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></>;
}

export default function App() {
  const { user } = useAuth();
  return <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/*" element={user ? <AuthenticatedLayout /> : <Navigate to="/login" replace />} />
  </Routes>;
}
