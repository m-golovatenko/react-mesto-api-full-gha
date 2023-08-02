const { celebrate, Joi } = require('celebrate');
const { regex } = require('../utils/constants');

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(regex),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validationChangeProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validationChangeAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().regex(regex),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri().required().regex(regex),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  validationLogin,
  validationCreateUser,
  validationChangeProfile,
  validationUserId,
  validationChangeAvatar,
  validationCreateCard,
  validationCardId,
};
