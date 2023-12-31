import React from 'react';
import PopupWithForm from './PopupWithForm';

export default function EditAvatarPopup(props) {
  const avatarRef = React.useRef();

  function handleSubmit(evt) {
    evt.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarRef.current.value
    });
  }

  React.useEffect(() => {
    avatarRef.current.value = '';
  }, [props.isOpen]);

  return (
    <PopupWithForm
      name="change-avatar"
      title="Обновить аватар"
      buttonText={props.loading ? 'Coхранение...' : 'Сохранить'}
      isOpen={props.isOpen}
      onClose={props.onClose}
      onClick={props.onClose}
      onSubmit={handleSubmit}>
      <input
        ref={avatarRef}
        type="url"
        name="avatar"
        id="popup__input-avatar"
        className="popup__input popup__input_type_avatar"
        placeholder="Ссылка на новый аватар"
        required
      />
      <span className="popup__input-error popup__input-avatar-error"></span>
    </PopupWithForm>
  );
}
