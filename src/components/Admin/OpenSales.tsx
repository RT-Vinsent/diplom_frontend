import React, { useState } from 'react';
import ConfStepWrapper from '../Admin/ConfStepWrapper/ConfStepWrapper';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Компонент для открытия продаж билетов.
 *
 * @returns {React.FC} Компонент для открытия продаж билетов.
 */
const OpenSales: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const { token } = useAuth();

  /**
   * Обработчик открытия продаж билетов.
   */
  const handleOpenSales = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/sessions/open`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConfirmationMessage('Продажи успешно открыты.');
    } catch (error) {
      console.error('Ошибка при открытии продаж:', error);
      setConfirmationMessage('Ошибка при открытии продаж.');
    } finally {
      setModalVisible(false);
    }
  };

  return (
    <ConfStepWrapper title="Открыть продажи">
      <div className="text-center">
        <p className="conf-step__paragraph">Всё готово, теперь можно:</p>
        <Button type="accent" onClick={() => setModalVisible(true)}>Открыть продажу билетов</Button>
      </div>
      <Modal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Подтверждение открытия продаж"
        message="Вы уверены, что хотите открыть продажи билетов?"
        inputVisible={false}
        onSave={handleOpenSales}
      />
      {confirmationMessage && <p className="conf-step__confirmation">{confirmationMessage}</p>}
    </ConfStepWrapper>
  );
};

export default OpenSales;
