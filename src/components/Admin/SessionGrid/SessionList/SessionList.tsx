import React from 'react';
import { MovieType } from '../MovieList/MovieList';
import Session from './Session';

/**
 * Интерфейс для сеанса.
 */
export interface SessionType {
  id?: string; // id может быть необязательным для новых сеансов и строковым для временных идентификаторов
  hall_id: number;
  movie_id: number;
  time: string; // Формат времени: "hh:mm:ss"
  date: string; // Дата в формате "YYYY-MM-DD"
  seats_status: string; // Состояние мест в формате JSON
  status: string; // Статус сеанса
}

interface SessionListProps {
  halls: { id: number; name: string }[];
  sessions: SessionType[];
  movies: MovieType[];
  colors: string[];
  onDragStartSession: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, session: SessionType) => void;
  onDrag: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, hallId: number) => void;
  onDeleteSession: (id: string) => void;
}

/**
 * Компонент списка сеансов дял админки.
 *
 * @param {SessionListProps} props - Свойства компонента SessionList.
 * @returns {JSX.Element} Компонент SessionList.
 */
const SessionList: React.FC<SessionListProps> = ({
  halls, sessions, movies, colors,
  onDragStartSession, onDrag, onDragEnd, onDragOver, onDrop, onDeleteSession,
}) => {

  /**
   * Обработчик окончания касания для устройства с сенсорным экраном.
   *
   * @param {React.TouchEvent<HTMLDivElement>} e - Событие касания.
   * @param {number} hallId - ID зала.
   */
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>, hallId: number) => {
    onDrop(e, hallId);
    onDragEnd();
  };

  return (
    <div className="conf-step__seances">
      {halls.map(hall => (
        <div className="conf-step__seances-hall" key={hall.id}>
          <h3 className="conf-step__seances-title">{hall.name}</h3>
          <div
            className="conf-step__seances-timeline"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, hall.id)}
            onTouchEnd={(e) => handleTouchEnd(e, hall.id)}
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
};

export default SessionList;