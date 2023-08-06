class Api {
  constructor(data) {
    this._url = data.url;
    this._headers = data.headers;
  }

  //Status Check
  _checkStatus(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(`Код ошибки: $(res.status)`);
    }
  }

  //Get User Info - GET
  getUserInfo(token) {
    return fetch(`${this._url}/users/me`, {
      headers: 
      {...this._headers,
        Authorization: `Bearer ${token}`,
      }
    }).then(this._checkStatus);
  }

  //Cange User Info - PATCH
  changeUserInfo(data, token) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: 
      {...this._headers,
        Authorization: `Bearer ${token}`,
      }, 
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    }).then(this._checkStatus);
  }

  //Get Initial Cards - GET
  getInitialCards(token) {
    return fetch(`${this._url}/cards`, {
      headers: 
      {...this._headers,
        Authorization: `Bearer ${token}`,
      }
    }).then(this._checkStatus);
  }

  //Add Card - POST
  addCard(data, token) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: 
      {...this._headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    }).then(this._checkStatus);
  }

  //Delete Card - DELETE
  deleteCard(cardId, token) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      headers: 
      {...this._headers,
        Authorization: `Bearer ${token}`,
      }
    }).then(this._checkStatus);
  }

  //Toggle LIke
  changeLikeCardStatus(cardId, isLiked, token) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: `${!isLiked ? 'PUT' : 'DELETE'}`, 
      headers: 
      {...this._headers,
        Authorization: `Bearer ${token}`,
      }
    }).then(this._checkStatus);
  }

  //Change Avatar - PATCH
  changeAvatar(avatar, token) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: 
      {...this._headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(avatar)
    }).then(this._checkStatus);
  }
}

export const api = new Api({
  url: 'https://api.m-golovatenko.nomoreparties.co',
  
  headers: {
    'Content-Type': 'application/json'
  }
});
