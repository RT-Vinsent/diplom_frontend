import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import MovieList from '../../components/MovieList/MovieList';
import Nav from '../../components/Nav/Nav';
import useMovies from '../../hooks/useMovies';
import './HomePage.css';

/**
 * Компонент HomePage отображает список фильмов на выбранную дату.
 * 
 * @returns {React.FC} Компонент HomePage
 */
const HomePage: React.FC = () => {
  const location = useLocation(); // Получение объекта location для доступа к параметрам URL
  const searchParams = new URLSearchParams(location.search); // Получение параметров запроса из URL
  const dateParam = searchParams.get('date'); // Получение параметра даты из URL

  // временная зона +5 это 'Asia/Yekaterinburg'
  const timeZone = 'Asia/Yekaterinburg';

  /**
   * Получение текущей даты в указанной временной зоне.
   * 
   * @param {string} timeZone - Временная зона
   * @returns {string} - Текущая дата в формате YYYY-MM-DD
   */
  const getCurrentDate = (timeZone: string): string => {
    const today = new Date(); // Текущая дата
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: timeZone
    };

    // Форматируем дату в формате YYYY-MM-DD
    const formatter = new Intl.DateTimeFormat('en-CA', options);
    const formattedDate = formatter.format(today);

    return formattedDate;
  };

  // Инициализация состояния для выбранной даты
  const [selectedDate, setSelectedDate] = useState(dateParam || getCurrentDate(timeZone));

  // Хук для получения списка фильмов на выбранную дату
  const movies = useMovies(selectedDate);

  // Обновление выбранной даты при изменении параметра date в URL
  useEffect(() => {
    if (dateParam) {
      setSelectedDate(dateParam);
    } else if (location.pathname === '/') {
      setSelectedDate(getCurrentDate(timeZone));
    }
  }, [dateParam, location.pathname]);

  /**
   * Обработчик изменения даты.
   * 
   * @param {string} date - Новая выбранная дата
   */
  const handleDateChange = useCallback((date: string) => {
    setSelectedDate(date);
  }, []);

  return (
    <div className='page-container'>

      {/* Компонент навигации с обработчиком изменения даты */}
      <Nav selectedDate={selectedDate} onDateChange={handleDateChange} />

      {/* Компонент списка фильмов */}
      <MovieList movies={movies} />
      
    </div>
  );
};

export default HomePage;
