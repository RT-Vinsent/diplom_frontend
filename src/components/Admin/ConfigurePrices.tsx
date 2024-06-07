import React, { useState, useEffect } from 'react';
import ConfStepWrapper from '../Admin/ConfStepWrapper/ConfStepWrapper';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { useHalls } from '../../contexts/HallsContext';

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
      await updateHallPrices(selectedHallId, regularPrice, vipPrice);
      setModalVisible(false);
      setInitialRegularPrice(regularPrice);
      setInitialVipPrice(vipPrice);
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
      <ul className="conf-step__selectors-box">
        {halls.map(hall => (
          <li key={hall.id}>
            <input
              type="radio"
              className="conf-step__radio"
              name="prices-hall"
              value={hall.name}
              checked={selectedHallId === hall.id}
              onChange={() => setSelectedHallId(hall.id)}
            />
            <span className="conf-step__selector">{hall.name}</span>
          </li>
        ))}
      </ul>
      <p className="conf-step__paragraph">Установите цены для типов кресел:</p>
      <div className="conf-step__legend">
        <label className="conf-step__label">Цена, рублей
          <input
            type="number"
            className="conf-step__input"
            value={regularPrice}
            onChange={(e) => setRegularPrice(Number(e.target.value))}
            placeholder="0"
          />
        </label> за <span className="conf-step__chair conf-step__chair_standart"></span> обычные кресла
      </div>
      <div className="conf-step__legend">
        <label className="conf-step__label">Цена, рублей
          <input
            type="number"
            className="conf-step__input"
            value={vipPrice}
            onChange={(e) => setVipPrice(Number(e.target.value))}
            placeholder="0"
          />
        </label> за <span className="conf-step__chair conf-step__chair_vip"></span> VIP кресла
      </div>
      <fieldset className="conf-step__buttons text-center">
        <Button type="regular" onClick={handleCancel}>Отмена</Button>
        <Button type="accent" onClick={() => setModalVisible(true)}>Сохранить</Button>
      </fieldset>
      <Modal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Сохранение конфигурации"
        message="Цены успешно сохранены."
        inputVisible={false}
        onSave={handleSave}
      />
    </ConfStepWrapper>
  );
};

export default ConfigurePrices;
