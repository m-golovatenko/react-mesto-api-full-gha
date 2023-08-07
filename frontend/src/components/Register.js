import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as auth from '../utils/auth';

function Register({ setSuccessed, setInfoTooltipPopupOpen }) {
  const [formValue, setFormValue] = React.useState({ password: '', email: '' });
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;

    setFormValue({
      ...formValue,
      [name]: value
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { password, email } = formValue;
    auth
      .register(password, email)
      .then(() => {
        setSuccessed(true);
        setInfoTooltipPopupOpen(true);
        navigate('/sign-in');
      })
      .catch(e => {
        setSuccessed(false);
        setInfoTooltipPopupOpen(true);
        console.error(`Ошибка при регистрации пользователя: код ошибки (${e})`);
      });
  }

  return (
    <div className="auth">
      <form className="auth__form" name="auth" onSubmit={handleSubmit} noValidate>
        <h2 className="auth__title">Регистрация</h2>

        <input
          id="auth__input-email"
          className="auth__input auth__input_type_email"
          type="email"
          name="email"
          placeholder="Email"
          minLength="2"
          maxLength="40"
          value={formValue.email}
          onChange={handleChange}
          required
        />

        <span className="auth__input-error auth__input-name-error"></span>

        <input
          id="auth__input-password"
          className="auth__input auth__input_type_password"
          type="password"
          name="password"
          placeholder="Пароль"
          value={formValue.password}
          onChange={handleChange}
          minLength="2"
          maxLength="40"
          required
          autocomplete="off"
        />
        <span className="auth__input-error auth__input-name-error"></span>
        <button
          className="auth__save-button"
          type="submit"
          onSubmit={handleSubmit}
          aria-label="Зарегистрироваться">
          Зарегистрироваться
        </button>

        <p className="auth__text">
          Уже зарегистрированы?
          <Link to="/sign-in" className="auth__link">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
