import React, { useState } from 'react';
import ConfStepWrapper from './ConfStepWrapper/ConfStepWrapper';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import axios from 'axios';
import { useHalls } from '../../contexts/HallsContext';

/**
 * Компонент для управления залами.
 *
 * @returns {React.FC} Компонент для управления залами.
 */
const ManageHalls: React.FC = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [hallToDelete, setHallToDelete] = useState<number | null>(null);
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
    setCreateModalVisible(false);
  };

  /**
   * Обработчик подтверждения удаления зала.
   */
  const handleDelete = async () => {
    if (hallToDelete !== null) {
      try {
        await deleteHall(hallToDelete);
        setHallToDelete(null);
        setDeleteModalVisible(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          setNotificationMessage(error.response.data.message);
        } else {
          setNotificationMessage('Ошибка при удалении зала.');
          console.error('Ошибка при удалении зала:', error);
        }
        setNotificationModalVisible(true);
      }
    }
  };

  /**
   * Обработчик нажатия кнопки удаления зала.
   *
   * @param {number} hallId - Идентификатор зала для удаления.
   */
  const confirmDelete = (hallId: number) => {
    setHallToDelete(hallId);
    setDeleteModalVisible(true);
  };

  return (
    <ConfStepWrapper title="Управление залами">
      <p className="conf-step__paragraph">Доступные залы:</p>
      <ul className="conf-step__list">
        {halls.map((hall) => (
          <li key={hall.id}>
            {hall.name}
            <Button type="trash" onClick={() => confirmDelete(hall.id)} />
          </li>
        ))}
      </ul>

      <fieldset className="conf-step__buttons">
        <Button type="accent" onClick={() => setCreateModalVisible(true)}>Создать зал</Button>
      </fieldset>
      <Modal
        show={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSave={handleCreate}
        title="Создать новый зал"
        inputPlaceholder="Название зала"
        inputVisible={true}
      />
      <Modal
        show={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onSave={handleDelete}
        title="Подтверждение удаления"
        message="Вы уверены, что хотите удалить этот зал?"
        inputVisible={false}
        textNo="Нет"
        textYes="Да"
      />
      <Modal
        show={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
        title="Уведомление"
        message={notificationMessage}
        inputVisible={false}
        notification={true}
      />
    </ConfStepWrapper>
  );
};

export default ManageHalls;
