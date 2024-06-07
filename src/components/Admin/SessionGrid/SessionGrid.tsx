import React, { useState, useEffect } from 'react';
import ConfStepWrapper from '../ConfStepWrapper/ConfStepWrapper';
import Button from '../../Button/Button';
import Modal from '../../Modal/Modal';
import Calendar from '../../Calendar/Calendar';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import { useHalls } from '../../../contexts/HallsContext';
import { v4 as uuidv4 } from 'uuid';
import MovieList from './MovieList';
import SessionList from './SessionList';
import MovieModal from '../MovieModal/MovieModal';
import './SessionGrid.css';
import { formatDate, formatTimeToDate } from '../../../module/formatDate';

/**
 * Интерфейс для фильма.
 */
export interface Movie {
  id: number;
  title: string;
  duration: number;
  poster: string;
}

/**
 * Интерфейс для сеанса.
 */
export interface Session {
  id?: string; // id может быть необязательным для новых сеансов и строковым для временных идентификаторов
  hall_id: number;
  movie_id: number;
  time: string; // Формат времени: "hh:mm:ss"
  date: string; // Дата в формате "YYYY-MM-DD"
  seats_status: string; // Состояние мест в формате JSON
}

/**
 * Компонент для управления сеткой сеансов.
 *
 * @returns {React.FC} Компонент сетки сеансов.
 */
const SessionGrid: React.FC = () => {
  const { halls } = useHalls();
  const { token } = useAuth();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [deletedSessions, setDeletedSessions] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false);
  const [movieModalVisible, setMovieModalVisible] = useState(false); // Новое состояние для показа модального окна добавления фильма
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [draggedSession, setDraggedSession] = useState<Session | null>(null);
  const [draggedMovie, setDraggedMovie] = useState<Movie | null>(null);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const movieColors = [
    '#caff85', '#85ff89', '#85ffd3', '#85e2ff',
    '#8599ff', '#ba85ff', '#ff85fb', '#ff85b1',
    '#ffa285'
  ];

  useEffect(() => {
    resetState();
  }, [selectedDate]);

  /**
   * Получает список фильмов.
   */
  const fetchMovies = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/movies`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке фильмов:', error);
    }
  };

  /**
   * Получает сеансы по выбранной дате.
   *
   * @param {Date} date - Выбранная дата.
   */
  const fetchSessionsByDate = async (date: Date) => {
    try {
      const formattedDate = formatDate(date, 'YYYY-MM-DD');
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/sessions/by-date`, {
        params: { date: formattedDate },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSessions(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке сеансов:', error);
    }
  };

  /**
   * Сбрасывает состояние к последнему сохраненному.
   */
  const resetState = async () => {
    await fetchMovies();
    await fetchSessionsByDate(selectedDate);
  };

  /**
   * Обработчик сохранения конфигурации.
   */
  const handleSave = () => {
    setConfirmationModalVisible(true);
  };

  /**
   * Обработчик сохранения в модальном окне.
   */
  const handleModalSave = async () => {
    try {
      const updatedSessions = sessions.filter(session => session.id && !(typeof session.id === 'string' && session.id.startsWith('temp-')) && !deletedSessions.includes(session.id));
      const newSessions = sessions.filter(session => session.id && (typeof session.id === 'string' && session.id.startsWith('temp-')));

      await axios.put(`${process.env.REACT_APP_API_URL}/sessions`, updatedSessions, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      for (const sessionId of deletedSessions) {
        await axios.delete(`${process.env.REACT_APP_API_URL}/sessions/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      await axios.post(`${process.env.REACT_APP_API_URL}/sessions`, newSessions.map(session => {
        const { id, ...rest } = session;
        return rest;
      }), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setModalVisible(false);
      setConfirmationModalVisible(false);
    } catch (error) {
      console.error('Ошибка при сохранении сеансов:', error);
    }
  };

  /**
   * Обработчик закрытия модального окна.
   */
  const handleModalClose = () => {
    setModalVisible(false);
  };

  /**
   * Обработчик закрытия модального окна подтверждения.
   */
  const handleConfirmationModalClose = () => {
    setConfirmationModalVisible(false);
  };

  /**
   * Парсит время из строки в формат Date.
   *
   * @param {string} timeString - Строка времени.
   * @returns {Date} Объект Date.
   */
  const parseTime = (timeString: string): Date => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds, 0);
    return date;
  };

  /**
   * Обработчик начала перетаскивания сеанса.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - Событие перетаскивания.
   * @param {Session} session - Сеанс.
   */
  const handleDragStartSession = (e: React.DragEvent<HTMLDivElement>, session: Session) => {
    setDraggedSession(session);
    setDragStartX(e.clientX);
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Отключаем копию элемента
  };

  /**
   * Обработчик начала перетаскивания фильма.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - Событие перетаскивания.
   * @param {Movie} movie - Фильм.
   */
  const handleDragStartMovie = (e: React.DragEvent<HTMLDivElement>, movie: Movie) => {
    setDraggedMovie(movie);
    setDragStartX(e.clientX);
    e.dataTransfer.setDragImage(new Image(), 0, 0); // Отключаем копию элемента
  };

  /**
   * Обработчик перетаскивания.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - Событие перетаскивания.
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  /**
   * Обработчик сброса перетаскиваемого элемента.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - Событие перетаскивания.
   * @param {number} hallId - Идентификатор зала.
   */
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, hallId: number) => {
    if (!draggedMovie) return;

    const timeline = e.currentTarget.getBoundingClientRect();
    const deltaX = e.clientX - timeline.left;
    const minutesDelta = Math.round((deltaX / timeline.width) * 1440);
    const startTime = new Date(selectedDate);
    startTime.setHours(0, 0, 0, 0);
    startTime.setMinutes(minutesDelta);

    const newTime = formatTimeToDate(startTime);
    const hall = halls.find(hall => hall.id === hallId);
    const newSession: Session = {
      id: `temp-${uuidv4()}`,
      hall_id: hallId,
      movie_id: draggedMovie.id,
      time: newTime,
      date: formatDate(selectedDate, 'YYYY-MM-DD'),
      seats_status: hall ? JSON.stringify(hall.seats) : '[]',
    };
    setSessions([...sessions, newSession]);
    setDraggedMovie(null);
    setDragStartX(null);
  };

  /**
   * Обработчик перетаскивания элемента.
   *
   * @param {React.DragEvent<HTMLDivElement>} e - Событие перетаскивания.
   */
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    if (!dragStartX || !draggedSession) return;

    const deltaX = e.clientX - dragStartX;
    const timeline = e.currentTarget.parentElement!.getBoundingClientRect();
    const minutesDelta = Math.round((deltaX / timeline.width) * 1440); // Используем фактическую ширину таймлайна
    const startTime = parseTime(draggedSession.time);
    startTime.setMinutes(startTime.getMinutes() + minutesDelta);

    const newTime = formatTimeToDate(startTime);

    setSessions(prevSessions => prevSessions.map(session =>
      session.id === draggedSession.id ? { ...session, time: newTime } : session
    ));
  };

  /**
   * Обработчик окончания перетаскивания элемента.
   */
  const handleDragEnd = () => {
    setDraggedSession(null);
    setDraggedMovie(null); // Сброс draggedMovie при окончании перетаскивания
    setDragStartX(null);
  };

  /**
   * Обработчик удаления сеанса.
   *
   * @param {string} sessionId - Идентификатор сеанса.
   */
  const handleDeleteSession = (sessionId: string) => {
    setDeletedSessions(prev => [...prev, sessionId]);
    setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
  };

  /**
   * Обработчик клика на кнопку добавления фильма.
   */
  const handleAddMovieClick = () => {
    setMovieModalVisible(true);
  };

  /**
   * Обработчик сохранения фильма в модальном окне.
   *
   * @param {object} movie - Данные фильма.
   */
  const handleMovieModalSave = async (movie: { title: string, duration: number, origin: string, poster: string, synopsis: string }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/movies`, movie, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMovies([...movies, response.data]);
    } catch (error) {
      console.error('Ошибка при добавлении фильма:', error);
    }
  };

  return (
    <ConfStepWrapper title="Сетка сеансов">
      <div className="calendar-wrapper">
        <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      <p className="conf-step__paragraph">
        <Button type="accent" onClick={handleAddMovieClick}>Добавить фильм</Button>
      </p>

      <MovieList movies={movies} colors={movieColors} onDragStart={handleDragStartMovie} onDragEnd={handleDragEnd} />

      <SessionList
        halls={halls}
        sessions={sessions}
        movies={movies}
        colors={movieColors}
        onDragStartSession={handleDragStartSession}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDeleteSession={handleDeleteSession}
      />

      <fieldset className="conf-step__buttons text-center">
        <Button type="regular" onClick={resetState}>Отмена</Button>
        <Button type="accent" onClick={handleSave}>Сохранить</Button>
      </fieldset>

      <Modal
        show={modalVisible}
        onClose={handleModalClose}
        title="Сохранение конфигурации"
        message="Сеансы успешно сохранены."
        inputVisible={false}
        onSave={handleModalSave}
      />

      <Modal
        show={confirmationModalVisible}
        onClose={handleConfirmationModalClose}
        title="Подтверждение сохранения"
        message="Вы уверены, что хотите сохранить изменения?"
        inputVisible={false}
        onSave={handleModalSave}
      />
      
      <MovieModal
        show={movieModalVisible}
        onClose={() => setMovieModalVisible(false)}
        onSave={handleMovieModalSave}
      />
    </ConfStepWrapper>
  );
};

export default SessionGrid;
