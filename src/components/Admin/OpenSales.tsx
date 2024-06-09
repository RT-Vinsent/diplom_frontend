import React, { useState, useEffect } from 'react';
import ConfStepWrapper from '../Admin/ConfStepWrapper/ConfStepWrapper';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useHalls } from '../../contexts/HallsContext';
import HallSelector from '../Admin/HallSelector/HallSelector';

type ModalAction = 'open' | 'closed';

/**
 * Компонент OpenSales предназначен для управления продажами билетов в залах.
 * Позволяет открывать и закрывать продажи билетов для выбранного зала.
 */
const OpenSales: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [modalAction, setModalAction] = useState<ModalAction>('open');
  const [selectedHallId, setSelectedHallId] = useState<number | null>(null);
  const { token } = useAuth();
  const { halls, updateSessionStatus } = useHalls();

  useEffect(() => {
    if (halls.length > 0 && selectedHallId === null) {
      setSelectedHallId(halls[0].id);
    }
  }, [halls, selectedHallId]);

  /**
   * Обработчик действия по открытию или закрытию продаж.
   * 
   * @param action Действие, которое нужно выполнить ('open' или 'closed').
   */
  const handleSalesAction = async (action: ModalAction) => {
    if (!selectedHallId) return;

    try {
      const message = await updateSessionStatus(selectedHallId, action);
      setNotificationMessage(message);
    } catch (error) {
      console.error(`Ошибка при ${action === 'open' ? 'открытии' : 'закрытии'} продаж:`, error);
      setNotificationMessage(`Ошибка при ${action === 'open' ? 'открытии' : 'закрытии'} продаж.`);
    } finally {
      setModalVisible(false);
      setNotificationModalVisible(true);
    }
  };

  /**
   * Открывает модальное окно подтверждения действия.
   * 
   * @param action Действие, которое нужно подтвердить ('open' или 'closed').
   */
  const openModal = (action: ModalAction) => {
    setModalAction(action);
    setModalVisible(true);
  };

  return (
    <ConfStepWrapper title="Управление продажами">
      <p className="conf-step__paragraph">Выберите зал для изменения статуса продаж:</p>
      <HallSelector halls={halls} selectedHallId={selectedHallId} setSelectedHallId={setSelectedHallId} name="open-sales" />

      <p className="conf-step__paragraph">
        Продажи в зале можно как открыть, так и закрыть. Продажи на сеанс с уже проданными билетами не закрываются.
      </p>

      <fieldset className="conf-step__buttons">
        <Button type="accent" onClick={() => openModal('open')}>Открыть продажу билетов</Button>
        <Button type="regular" onClick={() => openModal('closed')}>Закрыть продажу билетов</Button>
      </fieldset>

      <Modal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Подтверждение ${modalAction === 'open' ? 'открытия' : 'закрытия'} продаж`}
        message={`Вы уверены, что хотите ${modalAction === 'open' ? 'открыть' : 'закрыть'} продажи билетов для выбранного зала?`}
        inputVisible={false}
        onSave={() => handleSalesAction(modalAction)}
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

export default OpenSales;
