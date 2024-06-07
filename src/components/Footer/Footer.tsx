import React from 'react';
import './Footer.css';

/**
 * Компонент Footer отображает нижний колонтитул страницы с информацией о дипломной работе.
 *
 * @returns Компонент нижнего колонтитула страницы.
 */
const Footer: React.FC = () => {
  return (
    <footer className="page-footer">
      {/* Текст с информацией о дипломной работе */}
      Дипломная работа 2024. Таштабанов Роман.
    </footer>
  );
};

export default Footer;
