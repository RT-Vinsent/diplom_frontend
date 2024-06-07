import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

/**
 * Компонент страницы авторизации.
 * Позволяет пользователю ввести email и пароль для входа в систему.
 *
 * @returns {React.FC} Компонент страницы авторизации.
 */
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  /**
   * Обработчик отправки формы авторизации.
   *
   * @param {React.FormEvent} e - Событие отправки формы.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      navigate('/admin/admin');
    } else {
      console.error('Ошибка авторизации');
    }
  };

  return (
    <main>
      <section className="login">
        <header className="login__header">
          <h2 className="login__title">Авторизация</h2>
        </header>
        <div className="login__wrapper">
          <form className="login__form" onSubmit={handleSubmit}>
            <label className="login__label" htmlFor="email">
              E-mail
              <input
                className="login__input"
                type="email"
                placeholder="example@domain.xyz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label className="login__label" htmlFor="password">
              Пароль
              <input
                className="login__input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <div className="text-center">
              <input value="Авторизоваться" type="submit" className="login__button" />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Login;
