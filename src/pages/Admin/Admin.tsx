import React from 'react';
import ManageHalls from '../../components/Admin/ManageHalls';
import ConfigureHalls from '../../components/Admin/ConfigureHalls';
import ConfigurePrices from '../../components/Admin/ConfigurePrices';
import SessionGrid from '../../components/Admin/SessionGrid/SessionGrid';
import OpenSales from '../../components/Admin/OpenSales';
import { HallsProvider } from '../../contexts/HallsContext';
import './Admin.css';

/**
 * Компонент страницы администратора.
 * Включает управление залами, конфигурацию залов и цен, сетку сеансов и открытие продаж.
 *
 * @returns {React.FC} Компонент страницы администратора.
 */
const Admin: React.FC = () => {
  return (
    <HallsProvider>
      <main className="conf-steps">
        <ManageHalls />
        <ConfigureHalls />
        <ConfigurePrices />
        <SessionGrid />
        <OpenSales />
      </main>
    </HallsProvider>
  );
};

export default Admin;
