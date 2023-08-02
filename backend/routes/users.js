const router = require('express').Router();
const {
  getUsers, getUserById, changeProfile, changeAvatar, getCurrentUser,
} = require('../controllers/users');
const { validationChangeProfile, validationChangeAvatar, validationUserId } = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validationUserId, getUserById);
router.patch('/me', validationChangeProfile, changeProfile);
router.patch('/me/avatar', validationChangeAvatar, changeAvatar);

module.exports = router;
