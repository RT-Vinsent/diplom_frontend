import React, { useRef, useEffect } from 'react';
import './MovieList.css';

/**
 * Интерфейс для фильма.
 */
export interface MovieType {
  id: number;
  title: string;
  duration: number;
  poster: string;
}

interface MovieListProps {
  movies: MovieType[];
  colors: string[];
  onDragStart: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, movie: MovieType) => void;
  onDragEnd: () => void;
}

interface MovieProps {
  movie: MovieType;
  color: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, movie: MovieType) => void;
  onDragEnd: () => void;
}

/**
 * Компонент для отображения фильма в списке фильмов.
 *
 * @param {MovieProps} props - Свойства компонента Movie.
 * @returns {React.FC} Компонент Movie.
 */
const Movie: React.FC<MovieProps> = ({ movie, color, onDragStart, onDragEnd }) => {
  const posterSrc = movie.poster.startsWith('http') ? movie.poster : `../${movie.poster}`;
  const movieRef = useRef<HTMLDivElement>(null);
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
      thumbnail.style.left = `${clientX}px`;
      thumbnail.style.top = `${clientY}px`;
    }
  };

  /**
   * Обработчик начала перетаскивания.
   *
   * @param {React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>} e - Событие перетаскивания.
   * @param {MovieType} movie - Фильм.
   */
  const handleDragStart = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>, movie: MovieType) => {
    onDragStart(e, movie);
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
    const thumbnail = thumbnailRef.current;
    if (thumbnail) {
      thumbnail.style.display = 'block';
      updateThumbnailPosition(clientX, clientY);
    }
  };

  /**
   * Обработчик перемещения во время перетаскивания.
   *
   * @param {MouseEvent | TouchEvent} e - Событие перемещения.
   */
  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    const clientX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    const clientY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
    updateThumbnailPosition(clientX, clientY);
    e.preventDefault();
  };

  /**
   * Обработчик окончания перетаскивания.
   *
   * @param {React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>} e - Событие окончания перетаскивания.
   */
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    onDragEnd();
    const thumbnail = thumbnailRef.current;
    if (thumbnail) {
      thumbnail.style.display = 'none';
    }
    if ('changedTouches' in e) {
      const touch = e.changedTouches[0];
      const dropEvent = new MouseEvent('drop', {
        clientX: touch.clientX,
        clientY: touch.clientY,
        bubbles: true,
        cancelable: true,
      });
      document.elementFromPoint(touch.clientX, touch.clientY)?.dispatchEvent(dropEvent);
    }
  };

  useEffect(() => {
    const element = movieRef.current;
    if (element) {
      element.addEventListener('mousemove', handleDragMove);
      element.addEventListener('touchmove', handleDragMove, { passive: false });
      return () => {
        element.removeEventListener('mousemove', handleDragMove);
        element.removeEventListener('touchmove', handleDragMove);
      };
    }
  }, []);

  return (
    <>
      <div
        id={`movie-${movie.id}`}
        ref={movieRef}
        className="conf-step__movie"
        style={{ backgroundColor: color }}
        draggable
        onDragStart={(e) => handleDragStart(e, movie)}
        onDrag={(e) => handleDragMove(e as unknown as MouseEvent)}
        onDragEnd={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e, movie)}
        onTouchEnd={handleDragEnd}
      >
        <img className="conf-step__movie-poster" alt="poster" src={posterSrc} />
        <h3 className="conf-step__movie-title">{movie.title}</h3>
        <p className="conf-step__movie-duration">{movie.duration} мин.</p>
      </div>
      <div
        ref={thumbnailRef}
        style={{
          display: 'none',
          position: 'fixed',
          pointerEvents: 'none',
          width: '38px',
          height: '50px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backgroundImage: `url(${posterSrc})`,
          backgroundSize: 'cover',
        }}
      />
    </>
  );
};

/**
 * Компонент списка фильмов.
 *
 * @param {MovieListProps} props - Свойства компонента MovieList.
 * @returns {React.FC} Компонент MovieList.
 */
const MovieList: React.FC<MovieListProps> = ({ movies, colors, onDragStart, onDragEnd }) => (
  <div className="conf-step__movies">
    {movies.map((movie, index) => (
      <Movie
        key={movie.id}
        movie={movie}
        color={colors[index % colors.length]}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />
    ))}
  </div>
);

export default MovieList;
