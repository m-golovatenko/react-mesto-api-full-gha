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
  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      headers: this._headers
    }).then(this._checkStatus);
  }

  //Cange User Info - PATCH
  changeUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    }).then(this._checkStatus);
  }

  //Get Initial Cards - GET
  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      headers: this._headers
    }).then(this._checkStatus);
  }

  //Add Card - POST
  addCard(data) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    }).then(this._checkStatus);
  }

  //Delete Card - DELETE
  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers
    }).then(this._checkStatus);
  }

  //Like Card - PUT
  likeCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'PUT',
      credentials: 'include',
      headers: this._headers
    }).then(this._checkStatus);
  }

  //Unlike Card - DELETE
  unlikeCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      credentials: 'include',
      headers: this._headers
    }).then(this._checkStatus);
  }

  //Toggle LIke
  changeLikeCardStatus(cardId, isLiked) {
    if (!isLiked) {
      return this.likeCard(cardId);
    } else {
      return this.unlikeCard(cardId);
    }
  }

  //Change Avatar - PATCH
  changeAvatar(avatar) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      credentials: 'include',
      headers: this._headers,
      body: JSON.stringify(avatar)
    }).then(this._checkStatus);
  }
}

export const api = new Api({
  url: 'http://localhost:4000',
  headers: {
    authorization: `Bearer ${localStorage.getItem('jwt')}`,
    'Content-Type': 'application/json'
  }
});
