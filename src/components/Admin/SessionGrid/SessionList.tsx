import React from 'react';
import { Session as SessionType, Movie as MovieType } from './SessionGrid';

interface SessionProps {
  session: SessionType;
  movie: MovieType;
  color: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, session: SessionType) => void;
  onDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDelete: (id: string) => void;
}

/**
 * Компонент для отображения сеанса в сетке сеансов.
 *
 * @param {SessionProps} props - Свойства компонента Session.
 * @returns {React.FC} Компонент Session.
 */
const Session: React.FC<SessionProps> = ({ session, movie, color, onDragStart, onDrag, onDragEnd, onDelete }) => {
  const startTime = new Date(`1970-01-01T${session.time}`);
  const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const left = (startMinutes / 1440) * 100; // 1440 минут в 24 часах
  const width = (movie.duration / 1440) * 100;

  /**
   * Вычисляет время окончания сеанса.
   *
   * @param {Date} startTime - Время начала сеанса.
   * @param {number} duration - Длительность фильма в минутах.
   * @returns {string} Время окончания сеанса в формате "HH:mm:ss".
   */
  const calculateEndTime = (startTime: Date, duration: number): string => {
    const endTime = new Date(startTime.getTime() + duration * 60000); // Добавляем длительность фильма в миллисекундах
    const hours = endTime.getHours().toString().padStart(2, '0');
    const minutes = endTime.getMinutes().toString().padStart(2, '0');
    const seconds = endTime.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const endTime = calculateEndTime(startTime, movie.duration);

  return (
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
    >
      <button
        className="delete-button"
        onClick={() => onDelete(session.id!)}
      >×</button>
      <p className="conf-step__seances-movie-title">{movie.title}</p>
      <p className="conf-step__seances-movie-start">{session.time}</p>
      <p className="conf-step__seances-movie-end">{endTime}</p>
    </div>
  );
};

interface SessionListProps {
  halls: { id: number; name: string }[];
  sessions: SessionType[];
  movies: MovieType[];
  colors: string[];
  onDragStartSession: (e: React.DragEvent<HTMLDivElement>, session: SessionType) => void;
  onDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, hallId: number) => void;
  onDeleteSession: (id: string) => void;
}

/**
 * Компонент списка сеансов.
 *
 * @param {SessionListProps} props - Свойства компонента SessionList.
 * @returns {React.FC} Компонент SessionList.
 */
const SessionList: React.FC<SessionListProps> = ({
  halls, sessions, movies, colors,
  onDragStartSession, onDrag, onDragEnd, onDragOver, onDrop, onDeleteSession,
}) => (
  <div className="conf-step__seances">
    {halls.map(hall => (
      <div className="conf-step__seances-hall" key={hall.id}>
        <h3 className="conf-step__seances-title">{hall.name}</h3>
        <div
          className="conf-step__seances-timeline"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, hall.id)}
        >
          {sessions.filter(session => session.hall_id === hall.id).map(session => {
            const movie = movies.find(movie => movie.id === session.movie_id);
            if (!movie) return null;
            const movieIndex = movies.findIndex(m => m.id === movie.id);
            return (
              <Session
                key={session.id}
                session={session}
                movie={movie}
                color={colors[movieIndex % colors.length]}
                onDragStart={onDragStartSession}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
                onDelete={onDeleteSession}
              />
            );
          })}
        </div>
      </div>
    ))}
  </div>
);

export default SessionList;
