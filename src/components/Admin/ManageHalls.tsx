import React, { useState } from 'react';
import ConfStepWrapper from './ConfStepWrapper/ConfStepWrapper';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { useHalls } from '../../contexts/HallsContext';

/**
 * Компонент для управления залами.
 *
 * @returns {React.FC} Компонент для управления залами.
 */
const ManageHalls: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { halls, addHall, deleteHall } = useHalls();

  /**
   * Обработчик создания нового зала.
   *
   * @param {string} newHallName - Название нового зала.
   */
  const handleCreate = async (newHallName: string) => {
    if (newHallName.trim() === '') {
      return;
    }
    await addHall(newHallName);
    setModalVisible(false);
  };

  return (
    <ConfStepWrapper title="Управление залами">
      <p className="conf-step__paragraph">Доступные залы:</p>
      <ul className="conf-step__list">
        {halls.map((hall) => (
          <li key={hall.id}>
            {hall.name}
            <Button type="trash" onClick={() => deleteHall(hall.id)} />
          </li>
        ))}
      </ul>
      <Button type="accent" onClick={() => setModalVisible(true)}>Создать зал</Button>
      <Modal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleCreate}
        title="Создать новый зал"
        inputPlaceholder="Название зала"
        inputVisible={true}
      />
    </ConfStepWrapper>
  );
};

export default ManageHalls;
