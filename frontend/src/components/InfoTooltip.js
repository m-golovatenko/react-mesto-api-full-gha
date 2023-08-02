import React from 'react';
import success from '../images/registration-success.svg';
import fail from '../images/registration-fail.svg';

function InfoTooltip(props) {
  return (
    <div
      className={`popup popup_${props.name} ${props.isOpen ? 'popup_opened' : ''}`}
      onClick={props.onClose}>
      <div className="popup__container" onClick={evt => evt.stopPropagation()}>
        <img
          className="popup__register-image"
          src={props.isSuccessed ? success : fail}
          alt={props.isSuccessed ? 'Успешная регистрация.' : 'Что-то пошло не так.'}
        />
        <p className="popup__register-text">
          {props.isSuccessed
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте ещё раз.'}
        </p>
        <button
          className="popup__close-button"
          type="button"
          onClick={props.onClose}
          aria-label="Закрыть"></button>
      </div>
    </div>
  );
}

export default InfoTooltip;
