const router = require('express').Router();

const { register, login, getUser} = require('../controllers/authController');
const validate = require('../middlewares/reqValidation');

const protect= require('../middlewares/auth');

router.route('/register')
  .post(register)

router.route('/login')
  .post(login)

router.route('/me')
  .get(protect, getUser)

module.exports = router;