import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { setCookie, getCookie, deleteCookie } from '../module/cookies';
import axios from 'axios';

/**
 * Интерфейс для контекста аутентификации.
 */
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Провайдер контекста аутентификации.
 *
 * @param {Object} props - Свойства компонента.
 * @param {ReactNode} props.children - Дочерние элементы.
 * @returns {React.FC} Компонент провайдера аутентификации.
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(getCookie('token'));

  useEffect(() => {
    if (token) {
      const expirationTime = getExpirationTime(token);
      const currentTime = Date.now();

      if (expirationTime <= currentTime) {
        logout();
      } else {
        const timeoutId = setTimeout(() => {
          logout();
        }, expirationTime - currentTime);

        return () => clearTimeout(timeoutId);
      }
    }
  }, [token]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (token) {
        refreshToken();
      }
    }, 15 * 60 * 1000); // Обновляем токен каждые 15 минут

    return () => clearInterval(interval);
  }, [token]);

  /**
   * Устанавливает токен аутентификации.
   *
   * @param {string | null} newToken - Новый токен.
   */
  const setToken = (newToken: string | null) => {
    if (newToken) {
      setCookie('token', newToken, 7); // Сохраняем токен на 7 дней
    } else {
      deleteCookie('token');
    }
    setTokenState(newToken);
  };

  /**
   * Обновляет токен аутентификации.
   */
  const refreshToken = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/refresh-token`, { token });
      setToken(response.data.token);
    } catch (error) {
      console.error('Ошибка при обновлении токена:', error);
      logout();
    }
  };

  /**
   * Выполняет выход пользователя.
   */
  const logout = () => {
    deleteCookie('token');
    setTokenState(null);
  };

  /**
   * Получает время истечения срока действия токена.
   *
   * @param {string} token - Токен JWT.
   * @returns {number} - Время истечения срока действия токена в миллисекундах.
   */
  const getExpirationTime = (token: string): number => {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.exp * 1000;
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Хук для использования контекста аутентификации.
 *
 * @returns {AuthContextType} Контекст аутентификации.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
