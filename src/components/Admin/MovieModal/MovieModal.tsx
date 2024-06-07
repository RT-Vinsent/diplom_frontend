import React, { useState } from 'react';
import Modal from '../../Modal/Modal';
import './MovieModal.css';

interface MovieModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (movie: { title: string, duration: number, origin: string, poster: string, synopsis: string }) => void;
}

/**
 * Компонент модального окна для добавления фильма.
 *
 * @param {MovieModalProps} props - Свойства компонента MovieModal.
 * @returns {React.FC} Компонент MovieModal.
 */
const MovieModal: React.FC<MovieModalProps> = ({ show, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [origin, setOrigin] = useState('');
  const [poster, setPoster] = useState('');
  const [synopsis, setSynopsis] = useState('');

  /**
   * Обработчик сохранения фильма.
   */
  const handleSave = () => {
    onSave({ title, duration: Number(duration), origin, poster, synopsis });
    setTitle('');
    setDuration('');
    setOrigin('');
    setPoster('');
    setSynopsis('');
    onClose();
  };

  return (
    <Modal
      show={show}
      onClose={onClose}
      onSave={handleSave}
      title="Добавить фильм"
      inputVisible={false}
    >
      <div className="movie-modal__input-group">
        <label>Название фильма</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="movie-modal__input-group">
        <label>Продолжительность (минуты)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
      </div>
      <div className="movie-modal__input-group">
        <label>Страна</label>
        <input
          type="text"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
      </div>
      <div className="movie-modal__input-group">
        <label>Ссылка на постер</label>
        <input
          type="text"
          value={poster}
          onChange={(e) => setPoster(e.target.value)}
        />
      </div>
      <div className="movie-modal__input-group">
        <label>Описание</label>
        <textarea
          value={synopsis}
          onChange={(e) => setSynopsis(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default MovieModal;
