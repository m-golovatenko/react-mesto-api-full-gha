const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const WrongDataError = require('../errors/WrongDataError');
const ForbiddenError = require('../errors/ForbiddenError');

const { SUCCESS_CODE, SUCCESS_CREATE_CODE } = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_CODE).send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(SUCCESS_CREATE_CODE).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError('Переданы некорректные данные при создании карточки.'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;

  Card.findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена.');
    })
    .then((card) => {
      if (String(card.owner) === String(owner)) {
        Card.deleteOne(card)
          .then(() => res.status(SUCCESS_CODE).send(card))
          .catch(next);
      } else {
        throw new ForbiddenError('Не ваша карточка.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Переданы некорректные данные карточки при удалении.'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
        return;
      }
      res.status(SUCCESS_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Переданы некорректные данные для постановки лайка.'));
        return;
      }
      next(err);
    });
};

module.exports.unlikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным _id не найдена.'));
        return;
      }
      res.status(SUCCESS_CODE).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('Переданы некорректные данные для снятия лайка.'));
        return;
      }
      next(err);
    });
};
