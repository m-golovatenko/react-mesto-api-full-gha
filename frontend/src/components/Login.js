import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as auth from '../utils/auth';

function Login({ handleLogin, setHeaderInfo, setInfoTooltipPopupOpen, setCurrentUser }) {
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
      .login(password, email)
      .then(data => {
        localStorage.setItem('jwt', data.token);
        setCurrentUser(data);
        setHeaderInfo(email);
        handleLogin();
        navigate('/');
      })

      .catch(err => {
        setInfoTooltipPopupOpen(true);
        console.error(`Ошибка при входе. Код ошибки: ${err}`)});
  }

  return (
    <div className="auth">
      <form className="auth__form" name="login" onSubmit={handleSubmit} noValidate>
        <h2 className="auth__title">Вход</h2>
        <input
          id="auth__input-email"
          className="auth__input auth__input_type_email"
          type="text"
          name="email"
          placeholder="Email"
          minLength="2"
          maxLength="40"
          value={formValue.email}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <span className="auth__input-error auth__input-name-error"></span>
        <input
          id="auth__input-password"
          className="auth__input auth__input_type_password"
          type="password"
          name="password"
          placeholder="Пароль"
          minLength="6"
          maxLength="40"
          value={formValue.password}
          onChange={handleChange}
          required
          autoComplete="off"
        />
        <span className="auth__input-error auth__input-name-error"></span>
        <button className="auth__save-button" type="submit" aria-label="Войти">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
