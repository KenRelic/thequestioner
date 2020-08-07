const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userController');

const Token = require('../../model/Token');
const User = require('../../model/User');

router.get('/dashboard', userController.dashboard);
router.get('/events', userController.events);
router.get('/activity', userController.activity);
router.get('/settings', userController.settings);
router.get('/events/add', userController.newEvent);
router.get('/users/add', userController.newAdmin);
router.get('/users', userController.users);
router.post('/logout', userController.logout);
router.post('/signUp', [
  body('fullname').isLength(4),
  body('username').isEmail(),
  body('password').isLength({ min: 8 })
], async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  // create account here
})







// app.post('/user', body('email').custom(value => {
//   return User.findUserByEmail(value).then(user => {
//     if (user) {
//       return Promise.reject('E-mail already in use');
//     }
//   });
// }), (req, res) => {
//   // Handle the request
// });


module.exports = router;
