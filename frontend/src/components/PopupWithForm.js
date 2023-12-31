import React from 'react';

export default function PopupWithForm(props) {
  return (
    <div
      className={`popup popup_${props.name} ${props.isOpen ? 'popup_opened' : ''}`}
      onClick={props.onClose}>
      <div className="popup__container" onClick={evt => evt.stopPropagation()}>
        <h2 className="popup__title">{props.title}</h2>
        <form className="popup__form" name={props.name} onSubmit={props.onSubmit} noValidate>
          {props.children}
          <button className="popup__save-button" type="submit" aria-label="Сохранить">
            {props.buttonText}
          </button>
        </form>
        <button
          className="popup__close-button"
          type="button"
          onClick={props.onClose}
          aria-label="Закрыть"></button>
      </div>
    </div>
  );
}
