import React from 'react';
import './HallSelector.css';

/**
 * Интерфейс, описывающий зал.
 */
interface Hall {
  id: number;
  name: string;
}

/**
 * Свойства компонента HallSelector.
 */
interface HallSelectorProps {
  halls: Hall[];
  selectedHallId: number | null;
  setSelectedHallId: (id: number) => void;
  name: string;
}

/**
 * Компонент для выбора зала из списка.
 *
 * @param props - Свойства компонента HallSelector.
 * @returns Компонент для выбора зала.
 */
const HallSelector: React.FC<HallSelectorProps> = ({ halls, selectedHallId, setSelectedHallId, name }) => {
  return (
    <ul className="conf-step__selectors-box">
      {halls.map(hall => (
        <li key={hall.id}>
          <label className="conf-step__selector-label">
            <input
              type="radio"
              className="conf-step__radio"
              name={name}
              value={hall.name}
              checked={selectedHallId === hall.id}
              onChange={() => setSelectedHallId(hall.id)}
            />
            <span className="conf-step__selector">{hall.name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
};

export default HallSelector;
