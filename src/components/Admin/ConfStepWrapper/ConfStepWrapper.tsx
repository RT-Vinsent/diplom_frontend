import React, { useState } from 'react';
import './ConfStepWrapper.css';

interface ConfStepWrapperProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Компонент-обёртка для шагов конфигурации.
 *
 * @param {ConfStepWrapperProps} props - Свойства компонента ConfStepWrapper.
 * @returns {React.FC} Компонент ConfStepWrapper.
 */
const ConfStepWrapper: React.FC<ConfStepWrapperProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  /**
   * Обработчик переключения состояния открытости секции.
   */
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <section className="conf-step">
      <header
        className={`conf-step__header ${isOpen ? 'conf-step__header_opened' : 'conf-step__header_closed'}`}
        onClick={handleToggle}
      >
        <h2 className="conf-step__title">{title}</h2>
      </header>
      {isOpen && <div className="conf-step__wrapper">{children}</div>}
    </section>
  );
};

export default ConfStepWrapper;
