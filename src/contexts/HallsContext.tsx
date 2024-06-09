import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { formatDate } from '../module/formatDate';
import { SessionType } from '../components/Admin/SessionGrid/SessionList/SessionList';

interface Hall {
  id: number;
  name: string;
  seats: string[][];
  price_regular: number;
  price_vip: number;
}

interface HallsContextType {
  halls: Hall[];
  sessions: SessionType[];
  setSessions: React.Dispatch<React.SetStateAction<SessionType[]>>;
  addHall: (name: string) => Promise<void>;
  deleteHall: (id: number) => Promise<void>;
  updateHallPrices: (id: number, regularPrice: number, vipPrice: number) => Promise<void>;
  updateSessionStatus: (hallId: number, status: string) => Promise<string>;
  fetchSessions: (date: Date) => Promise<void>;
}

const HallsContext = createContext<HallsContextType | undefined>(undefined);

/**
 * Провайдер HallsProvider предоставляет данные и функции для управления залами и сеансами кинотеатра.
 * 
 * @param children Дочерние элементы, которые будут иметь доступ к контексту.
 */
export const HallsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/halls`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedHalls = response.data.sort((a: Hall, b: Hall) => a.name.localeCompare(b.name));
        setHalls(sortedHalls);
      } catch (error) {
        console.error('Ошибка при получении залов:', error);
      }
    };

    fetchHalls();
  }, [token]);

  /**
   * Добавляет новый зал.
   * 
   * @param name Название нового зала.
   */
  const addHall = async (name: string) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/halls`, { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 201) {
        const newHallResponse = await axios.get(`${process.env.REACT_APP_API_URL}/halls`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const sortedHalls = newHallResponse.data.sort((a: Hall, b: Hall) => a.name.localeCompare(b.name));
        setHalls(sortedHalls);
      }
    } catch (error) {
      console.error('Ошибка при создании зала:', error);
    }
  };

  /**
   * Удаляет зал по его ID.
   * 
   * @param id ID зала для удаления.
   */
  const deleteHall = async (id: number) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/halls/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHalls(halls.filter(hall => hall.id !== id));
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * Обновляет цены на билеты для зала.
   * 
   * @param id ID зала.
   * @param regularPrice Новая цена для обычных мест.
   * @param vipPrice Новая цена для VIP мест.
   */
  const updateHallPrices = async (id: number, regularPrice: number, vipPrice: number) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/halls/${id}/prices`, { regularPrice, vipPrice }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHalls(halls.map(hall => hall.id === id ? { ...hall, price_regular: regularPrice, price_vip: vipPrice } : hall));
    } catch (error) {
      console.error('Ошибка при обновлении цен зала:', error);
      throw error;
    }
  };

  /**
   * Обновляет статус сеансов в зале.
   * 
   * @param hallId ID зала.
   * @param status Новый статус для сеансов ('open' или 'closed').
   * @returns Сообщение об успешности операции.
   */
  const updateSessionStatus = async (hallId: number, status: string): Promise<string> => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/sessions/status`, { hallId, status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSessions(prevSessions => prevSessions.map(session => session.hall_id === hallId ? { ...session, status } : session));
      return response.data.message;
    } catch (error) {
      console.error(`Ошибка при изменении статуса сеансов:`, error);
      throw error;
    }
  };

  /**
   * Загружает сеансы на выбранную дату.
   * 
   * @param date Дата для загрузки сеансов.
   */
  const fetchSessions = async (date: Date) => {
    try {
      const formattedDate = formatDate(date, 'YYYY-MM-DD');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/sessions/by-date`, {
        params: { date: formattedDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке сеансов:', error);
    }
  };

  return (
    <HallsContext.Provider value={{ halls, sessions, setSessions, addHall, deleteHall, updateHallPrices, updateSessionStatus, fetchSessions }}>
      {children}
    </HallsContext.Provider>
  );
};

/**
 * Хук для использования контекста HallsContext.
 * 
 * @returns Контекст HallsContext.
 */
export const useHalls = () => {
  const context = useContext(HallsContext);
  if (!context) {
    throw new Error('useHalls must be used within a HallsProvider');
  }
  return context;
};
