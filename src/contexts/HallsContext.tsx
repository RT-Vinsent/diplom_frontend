import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

/**
 * Интерфейс для зала.
 */
interface Hall {
  id: number;
  name: string;
  seats: string[][];
  price_regular: number;
  price_vip: number;
}

/**
 * Тип контекста для залов.
 */
interface HallsContextType {
  halls: Hall[];
  addHall: (name: string) => Promise<void>;
  deleteHall: (id: number) => Promise<void>;
  updateHallPrices: (id: number, regularPrice: number, vipPrice: number) => Promise<void>;
}

const HallsContext = createContext<HallsContextType | undefined>(undefined);

/**
 * Провайдер контекста залов.
 *
 * @param {Object} props - Свойства компонента.
 * @param {ReactNode} props.children - Дочерние элементы.
 * @returns {React.FC} Компонент провайдера залов.
 */
export const HallsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [halls, setHalls] = useState<Hall[]>([]);
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

  const deleteHall = async (id: number) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/halls/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHalls(halls.filter(hall => hall.id !== id));
    } catch (error) {
      console.error('Ошибка при удалении зала:', error);
    }
  };

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
    }
  };

  return (
    <HallsContext.Provider value={{ halls, addHall, deleteHall, updateHallPrices }}>
      {children}
    </HallsContext.Provider>
  );
};

/**
 * Хук для использования контекста залов.
 *
 * @returns {HallsContextType} Контекст залов.
 */
export const useHalls = () => {
  const context = useContext(HallsContext);
  if (!context) {
    throw new Error('useHalls must be used within a HallsProvider');
  }
  return context;
};
