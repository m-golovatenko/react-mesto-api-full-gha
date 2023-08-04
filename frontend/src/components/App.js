import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Header from './Header';
import Main from './Main';
import ImagePopup from './ImagePopup';
import Footer from './Footer';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { api } from '../utils/api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';
import InfoTooltip from './InfoTooltip';

function App() {
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = React.useState(false);
  const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = React.useState(false);
  const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({ name: '', link: '', isOpen: false });
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [isLoading, setLoading] = React.useState(false);
  const [isLoggedIn, setLoggedIn] = React.useState(false);
  const [headerInfo, setHeaderInfo] = React.useState(null);
  const [isSuccessed, setSuccessed] = React.useState(null);

  const navigate = useNavigate();

  function checkToken() {
    const jwt = localStorage.getItem('jwt');
    auth
      .checkToken(jwt)
      .then(data => {
        if (!data) {
          return;
        }
        setLoggedIn(true);
        setHeaderInfo(data.email);
        navigate('/');
      })
      .catch(e => {
        setLoggedIn(false);
        setHeaderInfo(null);
      });
  }

  React.useEffect(() => {
    checkToken();
    // eslint-disable-next-line
  }, []);

  function signOut() {
    localStorage.removeItem('jwt');
    setHeaderInfo(null);
    setLoggedIn(false);
    navigate('/signin');
  }

  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (isLoggedIn) {
      Promise.all([api.getUserInfo(jwt), api.getInitialCards(jwt)])
        .then(([userData, cardData]) => {
          setCurrentUser(userData);
          setCards(cardData);
        })
        .catch(err => console.error(`Что-то пошло не так: ${err}`));
    }
  }, [isLoggedIn]);

  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(true);
  }

  function handleAddCardClick() {
    setAddPlacePopupOpen(true);
  }

  function handleDeleteCardClick(card) {
    setDeleteCardPopupOpen(true);
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setDeleteCardPopupOpen(false);
    setInfoTooltipPopupOpen(false);
    setSelectedCard({});
  }

  function handleCardClick(card) {
    setSelectedCard({ name: card.name, link: card.link, alt: card.name, isOpen: true });
  }

  function handleCardLike(card) {
    const jwt = localStorage.getItem('jwt');
    const isLiked = card.likes.some(i => i === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked, jwt)
      .then(newCard => {
        setCards(state => state.map(c => (c._id === card._id ? newCard : c)));
      })
      .catch(err => console.error(`Ошибка при постановке лайка: ${err}`));
  }

  function handleCardDelete() {
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    api
      .deleteCard(selectedCard._id, jwt)
      .then(() => {
        setCards(state => state.filter(c => c._id !== selectedCard._id));
      })
      .then(() => {
        closeAllPopups();
      })
      .catch(err => console.error(`Ошибка при удалении карточки: ${err}`))
      .finally(() => {
        setLoading(false);
      });
  }

  function handleUpdateUser(userData) {
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    api
      .changeUserInfo(userData, jwt)
      .then(userData => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch(err => console.error(`Ошибка при изменении данных пользователя: ${err}`))
      .finally(() => {
        setLoading(false);
      });
  }

  function handleUpdateAvatar(avatar) {
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    api
      .changeAvatar(avatar, jwt)
      .then(avatar => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch(err => console.error(`Ошибка при изменении аватара профиля: ${err}`))
      .finally(() => {
        setLoading(false);
      });
  }

  function handleAddPlaceSubmit(cardData) {
    const jwt = localStorage.getItem('jwt');
    setLoading(true);
    api
      .addCard(cardData, jwt)
      .then(newCard => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => console.error(`Ошибка при добавлении карточки: ${err}`))
      .finally(() => {
        setLoading(false);
      });
  }

  React.useEffect(() => {
    function closeOnEsc(evt) {
      if (evt.key === 'Escape') {
        closeAllPopups();
      }
    }

    if (
      isEditAvatarPopupOpen ||
      isEditProfilePopupOpen ||
      isAddPlacePopupOpen ||
      isDeleteCardPopupOpen
    ) {
      document.addEventListener('keydown', closeOnEsc);
    }
    return () => {
      document.removeEventListener('keydown', closeOnEsc);
    };
  }, [isEditAvatarPopupOpen, isEditProfilePopupOpen, isAddPlacePopupOpen, isDeleteCardPopupOpen]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="root">
        <div className="page">
          <Header headerInfo={headerInfo} signOut={signOut} />

          <Routes>
            <Route
              exact
              path="/"
              element={
                <ProtectedRoute
                  element={Main}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddCard={handleAddCardClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleDeleteCardClick}
                  isLoggedIn={isLoggedIn}
                />
              }
            />

            <Route
              path="/sign-in"
              element={
                <Login handleLogin={() => setLoggedIn(true)} setHeaderInfo={setHeaderInfo} setInfoTooltipPopupOpen={setInfoTooltipPopupOpen}/>
              }
            />
            <Route
              path="/sign-up"
              element={
                <Register
                  setSuccessed={setSuccessed}
                  setInfoTooltipPopupOpen={setInfoTooltipPopupOpen}
                />
              }
            />
          </Routes>

          {isLoggedIn && <Footer />}

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            loading={isLoading}
            onClick={closeAllPopups}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
            loading={isLoading}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            loading={isLoading}
          />

          <DeleteCardPopup
            onClose={closeAllPopups}
            isOpen={isDeleteCardPopupOpen}
            onDeleteCard={handleCardDelete}
            loading={isLoading}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          <InfoTooltip
            isSuccessed={isSuccessed}
            onClose={closeAllPopups}
            isOpen={isInfoTooltipPopupOpen}
          />
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
