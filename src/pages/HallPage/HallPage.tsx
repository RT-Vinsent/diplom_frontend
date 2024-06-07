import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useSessionData from '../../hooks/useSessionData';
import './HallPage.css';
import { formatDate } from '../../module/formatDate';
import Placeholder from '../../components/Placeholder/Placeholder';
import Button from '../../components/Button/Button';

/**
 * Страница выбора мест в зале.
 *
 * @returns {React.FC} Компонент страницы выбора мест.
 */
const HallPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const sessionId = parseInt(searchParams.get('sessionId') || '', 10);

  const sessionData = useSessionData(sessionId);

  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  /**
   * Получает индекс видимого места в ряду, пропуская "disabled" места.
   *
   * @param {string[]} row - Массив мест в ряду.
   * @param {number} seatIndex - Индекс места.
   * @returns {number} - Видимый индекс места.
   */
  const getVisibleSeatIndex = (row: string[], seatIndex: number): number => {
    let visibleSeatCount = 0;
    for (let i = 0; i <= seatIndex; i++) {
      if (row[i] !== 'disabled') {
        visibleSeatCount++;
      }
    }
    return visibleSeatCount - 1; // Возвращаем индекс видимого места
  };

  /**
   * Переключает выбор места.
   *
   * @param {number} row - Индекс ряда.
   * @param {number} seat - Индекс места.
   */
  const toggleSeatSelection = (row: number, seat: number) => {
    if (!sessionData) return;
    const seatType = sessionData.seats[row][seat];
    const seatPrice = Number(seatType === 'vip' ? sessionData.prices.vip : sessionData.prices.standart);
    const visibleSeatIndex = getVisibleSeatIndex(sessionData.seats[row], seat);
    const seatId = `${row}-${visibleSeatIndex}`;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      setTotalCost(prevTotal => prevTotal - seatPrice);
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
      setTotalCost(prevTotal => prevTotal + seatPrice);
    }
  };

  /**
   * Обработчик бронирования мест.
   */
  const handleBooking = async () => {
    if (!sessionData) return;
    const seatsWithVisibleNumbers = selectedSeats.map(seat => {
      const [row, seatIndex] = seat.split('-').map(Number);
      return `${row}-${seatIndex}`;
    });

    try {
      // Обновляем места в базе данных
      await axios.post(`${process.env.REACT_APP_API_URL}/update-seats`, {
        sessionId,
        selectedSeats: seatsWithVisibleNumbers
      });

      // Переходим на страницу оплаты
      navigate('/payment', {
        state: {
          sessionId,
          movie: sessionData.movie,
          hall: sessionData.hall,
          time: sessionData.time,
          date: sessionData.date,
          seats: seatsWithVisibleNumbers,
          totalCost
        }
      });
    } catch (error) {
      console.error('Ошибка при обновлении мест:', error);
    }
  };

  /**
   * Обработчик двойного клика для переключения режима полного экрана.
   */
  const handleDoubleClick = () => {
    setIsFullscreen(!isFullscreen);
  };

  /**
   * Проверяет, является ли место купленным.
   *
   * @param {number} row - Индекс ряда.
   * @param {number} seat - Индекс места.
   * @returns {boolean} - Является ли место купленным.
   */
  const isSeatTaken = (row: number, seat: number) => {
    if (!sessionData) return false;
    const visibleSeatIndex = getVisibleSeatIndex(sessionData.seats[row], seat);
    return sessionData.soldTickets.some(ticket => ticket.seat_row === row && ticket.seat_column === visibleSeatIndex);
  };

  if (!sessionData) {
    return <main className="page-container"><Placeholder text="Данные о сеансе отсутствуют." /></main>;
  }

  return (
    <main className="page-container" onDoubleClick={handleDoubleClick}>
      <section className="buying">
        <div className="buying__info">
          <div className="buying__info-description">
            <h2 className="buying__info-title">{sessionData.movie.title}</h2>
            <p className="buying__info-hall">{sessionData.hall}</p>
            <p className="buying__info-date">Дата: {formatDate(sessionData.date)}</p>
            <p className="buying__info-start">Начало сеанса: {sessionData.time.slice(0, 5)}</p>
            <p className="buying__info-total-cost">Общая стоимость: {totalCost.toFixed(2)} рублей</p>
          </div>
          <div className="buying__info-hint">
            <p>Тапните дважды,<br />чтобы увеличить</p>
          </div>
        </div>
        <div className={`buying-scheme ${isFullscreen ? 'fullscreen' : ''}`}>
          <div className="buying-scheme__wrapper">
            {sessionData.seats.map((row, rowIndex) => (
              <div key={rowIndex} className="buying-scheme__row">
                {row.map((seat, seatIndex) => {
                  const visibleSeatIndex = getVisibleSeatIndex(row, seatIndex);
                  const seatId = `${rowIndex}-${visibleSeatIndex}`;
                  const isSelected = selectedSeats.includes(seatId);
                  const isTaken = isSeatTaken(rowIndex, seatIndex);

                  if (seat === 'disabled') {
                    return <span key={seatIndex} className="buying-scheme__chair buying-scheme__chair_disabled"></span>;
                  }

                  return (
                    <span
                      key={seatIndex}
                      className={`buying-scheme__chair buying-scheme__chair_${seat} ${isSelected ? 'buying-scheme__chair_selected' : ''} ${isTaken ? 'buying-scheme__chair_taken' : ''}`}
                      onClick={() => !isTaken && seat !== 'disabled' && toggleSeatSelection(rowIndex, seatIndex)}
                    ></span>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="buying-scheme__legend">
            <div className="col">
              <p className="buying-scheme__legend-price">
                <span className="buying-scheme__chair buying-scheme__chair_standart"></span> Свободно (<span className="buying-scheme__legend-value">{sessionData.prices.standart}</span>руб)
              </p>
              <p className="buying-scheme__legend-price">
                <span className="buying-scheme__chair buying-scheme__chair_vip"></span> Свободно VIP (<span className="buying-scheme__legend-value">{sessionData.prices.vip}</span>руб)
              </p>
            </div>
            <div className="col">
              <p className="buying-scheme__legend-price">
                <span className="buying-scheme__chair buying-scheme__chair_taken"></span> Занято
              </p>
              <p className="buying-scheme__legend-price">
                <span className="buying-scheme__chair buying-scheme__chair_selected"></span> Выбрано
              </p>
            </div>
          </div>
        </div>
        <Button
          type="accent"
          className="acceptin-button"
          onClick={handleBooking}
          disabled={selectedSeats.length === 0}>
          Забронировать
        </Button>
      </section>
    </main>
  );
};

export default HallPage;
