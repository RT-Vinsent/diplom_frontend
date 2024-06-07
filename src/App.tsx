import React from 'react';
import './App.css';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import AdminHeader from './components/Header/AdminHeader';
import HomePage from './pages/HomePage/HomePage';
import HallPage from './pages/HallPage/HallPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import Footer from './components/Footer/Footer';
import TicketPage from './pages/TicketPage/TicketPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import Login from './pages/Login/Login';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import Admin from './pages/Admin/Admin';
import { AuthProvider } from './contexts/AuthContext';
import './style/normalize.css';

/**
 * Основной компонент приложения.
 * Определяет маршруты и предоставляет контекст авторизации.
 *
 * @component
 * @returns {JSX.Element} Основной компонент приложения
 */
const App: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <div className={`app-container ${isAdminRoute ? 'admin-container' : ''}`}>
        <Routes>
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="*" element={<DefaultRoutes />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

/**
 * Компонент для отображения маршрутов по умолчанию.
 *
 * @component
 * @returns {JSX.Element} Компонент маршрутов по умолчанию
 */
const DefaultRoutes: React.FC = () => (
  <>
    <Header />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hall" element={<HallPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/ticket" element={<TicketPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    <Footer />
  </>
);

/**
 * Компонент для отображения маршрутов администратора.
 *
 * @component
 * @returns {JSX.Element} Компонент маршрутов администратора
 */
const AdminRoutes: React.FC = () => (
  <>
    <AdminHeader />
    <Routes>
      <Route path="login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route path="" element={<Navigate to="admin" />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
    <Footer />
  </>
);

export default App;
