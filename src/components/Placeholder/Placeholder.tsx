import React from 'react';
import './Placeholder.css';

/**
 * Интерфейс для пропсов компонента Placeholder.
 */
interface PlaceholderProps {
  text: string;
}

/**
 * Компонент Placeholder для отображения сообщения-заполнителя.
 *
 * @param {PlaceholderProps} props - Пропсы компонента.
 * @returns {React.FC<PlaceholderProps>} Компонент Placeholder.
 */
const Placeholder: React.FC<PlaceholderProps> = ({ text }) => {
  return (
    <div className="placeholder">
      <p>{text}</p>
    </div>
  );
};

export default Placeholder;
