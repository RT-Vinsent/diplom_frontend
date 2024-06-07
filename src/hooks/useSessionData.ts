import { useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Интерфейс данных сеанса.
 */
interface SessionData {
  movie: {
    id: number;
    title: string;
    synopsis: string;
    duration: string;
    origin: string;
    poster: string;
  };
  hall: string;
  time: string;
  date: string;
  seats: string[][];
  prices: {
    standart: number;
    vip: number;
  };
  soldTickets: { seat_row: number, seat_column: number }[];
}

/**
 * Хук для получения данных сеанса по идентификатору.
 *
 * @param {number} sessionId - Идентификатор сеанса.
 * @returns {SessionData | null} Данные сеанса или null, если данные не загружены.
 */
const useSessionData = (sessionId: number) => {
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/session?sessionId=${sessionId}`);
        setSessionData(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных сеанса:', error);
      }
    };

    fetchData();
  }, [sessionId]);

  return sessionData;
};

export default useSessionData;
