import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

/**
 * Компонент Header отображает заголовок страницы с ссылкой на главную страницу.
 *
 * @returns Компонент заголовка страницы.
 */
const Header: React.FC = () => {
  return (
    <header className="page-header">
      <div className="page-header__logo">
        <h1 className="page-header__title">
          <Link to="/">Идём<span>в</span>кино</Link>
        </h1>
      </div>
      <Link to="/admin/" className="page-header__button">Админка</Link>
    </header>
  );
};

export default Header;
