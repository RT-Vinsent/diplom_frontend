import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NotFoundPage.css';

/**
 * Компонент страницы "404 - Страница не найдена".
 * Отображает сообщение об ошибке и кнопку для возврата на главную страницу.
 *
 * @returns {React.FC} Компонент страницы "404 - Страница не найдена".
 */
const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-container">
      <h1>404 - Страница не найдена</h1>
      <p>К сожалению, запрашиваемая страница не существует.</p>
      <button onClick={() => navigate('/')}>На главную</button>
    </div>
  );
};

export default NotFoundPage;
