import React, { useState, useEffect } from 'react';
import ConfStepWrapper from '../Admin/ConfStepWrapper/ConfStepWrapper';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { useHalls } from '../../contexts/HallsContext';
import HallSelector from './HallSelector/HallSelector';
import axios from 'axios';

/**
 * Компонент для конфигурации цен на билеты.
 *
 * @returns {React.FC} Компонент конфигурации цен.
 */
const ConfigurePrices: React.FC = () => {
  const { halls, updateHallPrices } = useHalls();
  const [selectedHallId, setSelectedHallId] = useState<number | null>(null);
  const [regularPrice, setRegularPrice] = useState<number>(0);
  const [vipPrice, setVipPrice] = useState<number>(0);
  const [initialRegularPrice, setInitialRegularPrice] = useState<number>(0);
  const [initialVipPrice, setInitialVipPrice] = useState<number>(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    if (halls.length > 0 && selectedHallId === null) {
      setSelectedHallId(halls[0].id);
    }
  }, [halls, selectedHallId]);

  useEffect(() => {
    if (selectedHallId !== null) {
      const hall = halls.find(hall => hall.id === selectedHallId);
      if (hall) {
        setRegularPrice(hall.price_regular);
        setVipPrice(hall.price_vip);
        setInitialRegularPrice(hall.price_regular);
        setInitialVipPrice(hall.price_vip);
      }
    }
  }, [selectedHallId, halls]);

  /**
   * Обработчик сохранения цен на билеты.
   */
  const handleSave = async () => {
    if (selectedHallId !== null) {
      try {
        await updateHallPrices(selectedHallId, regularPrice, vipPrice);
        setNotificationMessage('Цены успешно сохранены.');
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          setNotificationMessage(error.response.data.message);
        } else {
          setNotificationMessage('Ошибка при сохранении цен.');
        }
      } finally {
        setModalVisible(false);
        setNotificationModalVisible(true);
        handleCancel();
      }
    }
  };

  /**
   * Обработчик отмены изменений.
   */
  const handleCancel = () => {
    setRegularPrice(initialRegularPrice);
    setVipPrice(initialVipPrice);
  };

  return (
    <ConfStepWrapper title="Конфигурация цен">
      <p className="conf-step__paragraph">Выберите зал для конфигурации:</p>
      <HallSelector halls={halls} selectedHallId={selectedHallId} setSelectedHallId={setSelectedHallId} name="configure-price" />

      <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
      <div className="conf-step__legend">
        <div className="conf-step__price-wrapper">
          <label className="conf-step__label">
            <span className="conf-step__label-text">Цена, рублей</span>
            <input
              type="number"
              className="conf-step__input"
              value={regularPrice}
              onChange={(e) => setRegularPrice(Number(e.target.value))}
              placeholder="0"
            />
          </label>
          <div className="conf-step__text">
            <span>за</span>
            <span className="conf-step__chair conf-step__chair_standart"></span>
            <span>обычные кресла</span>
          </div>
        </div>
      </div>
      <div className="conf-step__legend">
        <div className="conf-step__price-wrapper">
          <label className="conf-step__label">
            <span className="conf-step__label-text">Цена, рублей</span>
            <input
              type="number"
              className="conf-step__input"
              value={vipPrice}
              onChange={(e) => setVipPrice(Number(e.target.value))}
              placeholder="0"
            />
          </label>
          <div className="conf-step__text">
            <span>за</span>
            <span className="conf-step__chair conf-step__chair_vip"></span>
            <span>VIP кресла</span>
          </div>
        </div>
      </div>
      <fieldset className="conf-step__buttons">
        <Button type="regular" onClick={handleCancel}>Отмена</Button>
        <Button type="accent" onClick={() => setModalVisible(true)}>Сохранить</Button>
      </fieldset>
      <Modal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Сохранение конфигурации"
        message="Вы уверены, что хотите сохранить изменения?"
        inputVisible={false}
        onSave={handleSave}
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

export default ConfigurePrices;
