require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/error-handler');
const limiter = require('./middlewares/rate-limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');
const { validationLogin, validationCreateUser } = require('./middlewares/validation');

const { PORT = 4001, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const NotFoundError = require('./errors/NotFoundError');

const app = express();
app.use(cors({
  origin: 'https://m-golovatenko.nomoreparties.co',
  credentials: true,
}));

app.use(requestLogger);

app.use(limiter);

app.use(bodyParser.json());
app.use(helmet());
app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);

app.use('*', () => {
  throw new NotFoundError('Страницы не существует.');
});
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('БД подключена');
  }).catch(() => {
    console.log('Ошибка при подключении БД');
  });

app.listen(PORT);
