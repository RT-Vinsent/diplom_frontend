import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';
import Placeholder from '../../components/Placeholder/Placeholder';
import { Movie as MovieType } from '../../components/Movie/Movie';
import { formatDate, formatTime } from '../../module/formatDate';
import { formatSeatString } from '../../module/formatSeats';
import Button from '../../components/Button/Button';

/**
 * Интерфейс для состояния, передаваемого через навигацию.
 */
export interface State {
  sessionId: string,
  movie: MovieType;
  hall: string;
  time: string;
  date: Date;
  seats: string[];
  totalCost: number;
}

/**
 * Страница оплаты билетов.
 *
 * @returns {React.FC} Компонент страницы оплаты билетов.
 */
const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const { sessionId, movie, hall, time, date, seats, totalCost } = (state || {}) as State;

  // Проверка на наличие данных о билете
  if (!sessionId || !movie || !hall || !time || !date || !seats || totalCost === undefined) {
    return <main className='page-container'><Placeholder text="Данные о билете отсутствуют." /></main>;
  }

  const seatStrings = seats.map((seat) => formatSeatString(seat));

  /**
   * Обработчик получения кода бронирования.
   */
  const handleGetTicket = () => {
    navigate('/ticket', {
      state: {
        sessionId,
        movie,
        hall,
        time,
        date,
        seats: seatStrings,
        totalCost
      }
    });
  };

  return (
    <main className='page-container'>
      <section className="ticket">
        <header className="ticket__check">
          <h2 className="ticket__check-title">Вы выбрали билеты:</h2>
        </header>

        <div className="ticket__info-wrapper">
          <p className="ticket__info">На фильм: <span className="ticket__details ticket__title">{movie.title}</span></p>
          <p className="ticket__info">Места: <span className="ticket__details ticket__chairs">{seatStrings.join(', ')}</span></p>
          <p className="ticket__info">В зале: <span className="ticket__details ticket__hall">{hall}</span></p>
          <p className="ticket__info">Дата: <span className="ticket__details ticket__date">{formatDate(date)}</span></p>
          <p className="ticket__info">Начало сеанса: <span className="ticket__details ticket__start">{formatTime(time)}</span></p>
          <p className="ticket__info">Стоимость: <span className="ticket__details ticket__cost">{totalCost.toFixed(2)}</span> рублей</p>

          <Button
            type="accent"
            className="acceptin-button"
            onClick={handleGetTicket}>
            Получить код бронирования
          </Button>

          <p className="ticket__hint">После оплаты билет будет доступен в этом окне, а также придёт вам на почту. Покажите QR-код нашему контроллеру у входа в зал.</p>
          <p className="ticket__hint">Приятного просмотра!</p>
        </div>
      </section>
    </main>
  );
};

export default PaymentPage;
