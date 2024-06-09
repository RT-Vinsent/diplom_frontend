import React, { useRef } from 'react';
import { SessionType } from '../SessionList/SessionList';
import { MovieType } from '../MovieList/MovieList';
import { formatTime } from '../../../../module/formatDate';
import './Session.css';

interface SessionProps {
  session: SessionType;
  movie: MovieType;
  color: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, session: SessionType) => void;
  onDrag: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDelete: (id: string) => void;
}

/**
 * Компонент для отображения сеанса для админки.
 *
 * @param {SessionProps} props - Свойства компонента Session.
 * @returns {JSX.Element} Компонент Session.
 */
const Session: React.FC<SessionProps> = ({ session, movie, color, onDragStart, onDrag, onDragEnd, onDelete }) => {
  const startTime = new Date(`1970-01-01T${session.time}`);
  const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const left = (startMinutes / 1440) * 100; // 1440 минут в 24 часах
  const width = (movie.duration / 1440) * 100;

  const thumbnailRef = useRef<HTMLDivElement>(null);

  /**
   * Обновляет позицию миниатюры.
   *
   * @param {number} clientX - Координата X клиента.
   * @param {number} clientY - Координата Y клиента.
   */
  const updateThumbnailPosition = (clientX: number, clientY: number) => {
    const thumbnail = thumbnailRef.current;
    if (thumbnail) {
      const thumbnailRect = thumbnail.getBoundingClientRect();
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      let newLeft = clientX;
      let newTop = clientY;

      if (clientX + thumbnailRect.width > screenWidth) {
        newLeft = screenWidth - thumbnailRect.width;
      }
      if (clientY + thumbnailRect.height > screenHeight) {
        newTop = screenHeight - thumbnailRect.height;
      }

      thumbnail.style.left = `${newLeft}px`;
      thumbnail.style.top = `${newTop}px`;
    }
  };

  /**
   * Обработчик перемещения мыши.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - Событие перемещения мыши.
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    updateThumbnailPosition(e.clientX, e.clientY);
  };

  /**
   * Обработчик наведения мыши.
   *
   * @param {React.MouseEvent<HTMLDivElement>} e - Событие наведения мыши.
   */
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const thumbnail = thumbnailRef.current;
    if (thumbnail) {
      thumbnail.style.display = 'flex';
      updateThumbnailPosition(e.clientX, e.clientY);
    }
  };

  /**
   * Обработчик ухода мыши.
   */
  const handleMouseLeave = () => {
    const thumbnail = thumbnailRef.current;
    if (thumbnail) {
      thumbnail.style.display = 'none';
    }
  };

  /**
   * Вычисляет время окончания сеанса.
   *
   * @param {Date} startTime - Время начала сеанса.
   * @param {number} duration - Длительность фильма.
   * @returns {string} Время окончания сеанса.
   */
  const calculateEndTime = (startTime: Date, duration: number): string => {
    const endTime = new Date(startTime.getTime() + duration * 60000); // Добавляем длительность фильма в миллисекундах
    const hours = endTime.getHours().toString().padStart(2, '0');
    const minutes = endTime.getMinutes().toString().padStart(2, '0');
    const seconds = endTime.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const endTime = calculateEndTime(startTime, movie.duration);

  /**
   * Обработчик начала касания.
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - Событие касания.
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    onDragStart(e, session);
  };

  /**
   * Обработчик перемещения касания.
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - Событие перемещения касания.
   */
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    onDrag(e);
  };

  /**
   * Обработчик окончания касания.
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - Событие окончания касания.
   */
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    onDragEnd();
  };

  return (
    <div>
      <div
        className="conf-step__seances-movie"
        style={{
          width: `${width}%`,
          left: `${left}%`,
          backgroundColor: color,
          position: 'absolute',
          cursor: 'grab'
        }}
        draggable
        onDragStart={(e) => onDragStart(e, session)}
        onDrag={onDrag}
        onDragEnd={onDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="delete-button"
          onClick={() => onDelete(session.id!)}
        >×</button>
        <p className="conf-step__seances-movie-title">{movie.title}</p>
        <p className="conf-step__seances-movie-start">{formatTime(session.time)}</p>
        <p className="conf-step__seances-movie-end">{formatTime(endTime)}</p>
      </div>
      <div className="conf-step__seances-movie-thumbnail" ref={thumbnailRef}>
        <img className="conf-step__movie-poster" alt="poster" src={movie.poster.startsWith('http') ? movie.poster : `../${movie.poster}`} />
        <h3 className="conf-step__movie-title">{movie.title}</h3>
        <p className="conf-step__movie-duration">{movie.duration} мин.</p>
        <p className="conf-step__movie-duration">{formatTime(session.time)}–{formatTime(endTime)}</p>
      </div>
    </div>
  );
};

export default Session;