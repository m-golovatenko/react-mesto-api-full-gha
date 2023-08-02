import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header({ headerInfo, signOut }) {
  const location = useLocation();

  return (
    <header className="header ">
      <Link to="/" className="header__logo" aria-label="Логотип прокта Место" />

      {location.pathname === '/sign-in' && (
        <Link to="/sign-up" className="header__link">
          Зарегистрироваться
        </Link>
      )}

      {location.pathname === '/sign-up' && (
        <Link to="/sign-in" className="header__link">
          Войти
        </Link>
      )}

      {location.pathname === '/' && (
        <div className="header__info">
          <p className="header__email">{headerInfo}</p>
          <Link to="/sign-in" className="header__link" onClick={signOut}>
            Выйти
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
