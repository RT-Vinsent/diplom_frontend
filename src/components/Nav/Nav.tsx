import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // , useLocation
import './Nav.css';
import { formatDate } from '../../module/formatDate';

/**
 * Интерфейс для пропсов компонента Nav.
 */
interface NavProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

/**
 * Компонент Nav для навигации по дням.
 * 
 * @param {NavProps} props - Пропсы компонента
 * @returns {React.FC<NavProps>} Компонент Nav
 */
const Nav: React.FC<NavProps> = ({ selectedDate, onDateChange }) => {
  const navigate = useNavigate(); // Хук для навигации
  // const location = useLocation(); // Хук для получения текущего местоположения
  // const searchParams = new URLSearchParams(location.search); // Получение параметров из URL
  // const dateParam = searchParams.get('date'); // Получение параметра даты из URL
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Убираем время для корректного сравнения дат

  const selectedDateObj = new Date(selectedDate);
  selectedDateObj.setHours(0, 0, 0, 0); // Убираем время для корректного сравнения дат

  // Рассчитываем начальную дату отображаемого периода
  const newStartDate = (selectedDateObj.getTime() - today.getTime()) / (1000 * 3600 * 24) > 6
    ? new Date(selectedDateObj.setDate(selectedDateObj.getDate() - 6))
    : today;

  // Инициализация состояния для начальной даты отображаемого периода
  const [startDate, setStartDate] = useState(newStartDate);

  // Генерация массива с датами для отображения
  const dates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i); // Увеличиваем дату на i дней
    const isToday = formatDate(date) === formatDate(today); // Проверка, является ли дата сегодняшним днем
    return {
      day: date.toLocaleDateString('ru-RU', { weekday: 'short' }), // День недели
      date: formatDate(date, 'YYYY-MM-DD'), // Форматированная дата
      number: date.getDate(), // Число
      isWeekend: date.getDay() === 6 || date.getDay() === 0, // Проверка, является ли день выходным
      isToday: isToday // Проверка, является ли день сегодняшним
    };
  });

  /**
   * Обработчик клика по дате
   * 
   * @param {string} date - Выбранная дата
   */
  const handleClick = (date: string) => {
    navigate(`/?date=${date}`); // Навигация с параметром даты
    onDateChange(date); // Вызов коллбэка с новой датой
  };

  /**
   * Обработчик для перехода на следующий день
   */
  const handleNext = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() + 1); // Увеличиваем дату на 1 день
    setStartDate(newStartDate); // Устанавливаем новое значение начальной даты
  };

  /**
   * Обработчик для перехода на предыдущий день
   */
  const handlePrev = () => {
    const newStartDate = new Date(startDate);
    newStartDate.setDate(newStartDate.getDate() - 1); // Уменьшаем дату на 1 день
    if (newStartDate >= today) {
      setStartDate(newStartDate); // Устанавливаем новое значение начальной даты, если оно не меньше сегодняшнего дня
    }
  };

  return (
    <nav className="page-nav">
      {/* Кнопка для перехода на предыдущий день */}
      <button className="page-nav__day page-nav__day_prev" onClick={handlePrev} disabled={startDate <= today}></button>

      {/* Отображение дат недели */}
      {dates.map((item) => (
        <a
          key={item.date}
          className={`page-nav__day ${item.isToday ? 'page-nav__day_today' : ''} ${item.isWeekend ? 'page-nav__day_weekend' : ''} ${item.date === selectedDate ? 'page-nav__day_chosen' : ''}`}
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleClick(item.date); // Обработчик клика по дате
          }}
        >
          <span className="page-nav__day-week">{item.day}</span>
          <span className="page-nav__day-number">{item.number}</span>
        </a>
      ))}

      {/* Кнопка для перехода на следующий день */}
      <button className="page-nav__day page-nav__day_next" onClick={handleNext}></button>
    </nav>
  );
};

export default Nav;
