import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Компонент для защиты маршрутов, требующих аутентификации.
 *
 * @returns {React.FC} Компонент защищенного маршрута.
 */
const ProtectedRoute: React.FC = () => {
  const { token } = useAuth();

  return token ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
