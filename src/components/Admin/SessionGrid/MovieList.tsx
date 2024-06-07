import React from 'react';
import { Movie as MovieType } from './SessionGrid';

interface MovieListProps {
  movies: MovieType[];
  colors: string[];
  onDragStart: (e: React.DragEvent<HTMLDivElement>, movie: MovieType) => void;
  onDragEnd: () => void;
}

interface MovieProps {
  movie: MovieType;
  color: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, movie: MovieType) => void;
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

  return (
    <div
      className="conf-step__movie"
      style={{ backgroundColor: color }}
      draggable
      onDragStart={(e) => onDragStart(e, movie)}
      onDragEnd={onDragEnd}
    >
      <img className="conf-step__movie-poster" alt="poster" src={posterSrc} />
      <h3 className="conf-step__movie-title">{movie.title}</h3>
      <p className="conf-step__movie-duration">{movie.duration} мин.</p>
    </div>
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
