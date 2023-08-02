export const BASE_URL = 'http://localhost:4000';

function checkStatus(res) {
  if (res.ok) {
    return res.json();
  } else {
    return Promise.reject(`Код ошибки: $(res.status)`);
  }
}

export const register = (password, email) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      password,
      email
    })
  }).then(checkStatus);
};

export const login = (password, email) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      password,
      email
    })
  }).then(checkStatus);
};

export const checkToken = token => {
  return fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`}
  })
  .then(checkStatus);
};
