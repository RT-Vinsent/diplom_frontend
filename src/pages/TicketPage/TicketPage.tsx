import React from 'react';
import { useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import './TicketPage.css';
import Placeholder from '../../components/Placeholder/Placeholder';
import { formatDate, formatTime } from '../../module/formatDate';
import { State } from '../PaymentPage/PaymentPage';

/**
 * Страница билета, отображающая информацию о заказанном билете и QR-код.
 *
 * @returns {React.FC} Компонент страницы билета.
 */
const TicketPage: React.FC = () => {
  const location = useLocation();
  const { state } = location;
  const { sessionId, movie, hall, time, date, seats, totalCost } = (state || {}) as State;

  // Если данные билета отсутствуют, отображаем Placeholder
  if (!sessionId || !movie || !hall || !time || !date || !seats || totalCost === undefined) {
    return <main className='page-container'><Placeholder text="Данные о билете отсутствуют." /></main>;
  }

  const seatString = seats.join(', ');

  // Данные для генерации QR-кода
  const qrData = {
    sessionId,
    movie: movie.title,
    hall,
    time: formatTime(time),
    date: formatDate(date),
    seats: seatString,
    totalCost,
    id: movie.id
  };

  return (
    <main className='page-container'>
      <section className="ticket">
        <header className="ticket__check">
          <h2 className="ticket__check-title">Электронный билет</h2>
        </header>

        <div className="ticket__info-wrapper">
          <p className="ticket__info">На фильм: <span className="ticket__details ticket__title">{movie.title}</span></p>
          <p className="ticket__info">Места: <span className="ticket__details ticket__chairs">{seatString}</span></p>
          <p className="ticket__info">В зале: <span className="ticket__details ticket__hall">{hall}</span></p>
          <p className="ticket__info">Дата: <span className="ticket__details ticket__date">{formatDate(date)}</span></p>
          <p className="ticket__info">Начало сеанса: <span className="ticket__details ticket__start">{formatTime(time)}</span></p>
          <p className="ticket__info">Стоимость: <span className="ticket__details ticket__cost">{totalCost.toFixed(2)}</span> рублей</p>

          <QRCode value={JSON.stringify(qrData)} className="ticket__info-qr" />

          <p className="ticket__hint">Покажите QR-код нашему контроллеру для подтверждения бронирования.</p>
          <p className="ticket__hint">Приятного просмотра!</p>
        </div>
      </section>
    </main>
  );
};

export default TicketPage;
