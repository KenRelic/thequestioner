const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');
const Token = require('../../model/Token');
const User = require('../../model/User');

// router.post('/login', userController.loginPage);
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







app.post('/user', body('email').custom(value => {
  return User.findUserByEmail(value).then(user => {
    if (user) {
      return Promise.reject('E-mail already in use');
    }
  });
}), (req, res) => {
  // Handle the request
});


module.exports = router;
