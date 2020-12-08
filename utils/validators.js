const { body } = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
  body('email', 'Enter correct email').isEmail().custom(async (value, { req }) => {
    try {
      const user = await User.findOne({ email: value });
      if (user) {
        return Promise.reject('Email in use');
      }
    }
    catch (err) {
      console.log(err);
    }
  }).normalizeEmail(),
  body('password', 'Password must have 6 characters').isLength({ min: 6 }).trim(),
  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Incorect password confirm');
    }
    return true;
  }).trim(),
  body('name').isAlpha().trim()
];

exports.loginValidators = [
  body('email', 'Incorect email adress').isEmail(),
  body('password', 'Incorect password length').isLength({ min: 6 }).trim()
];

exports.addValidators = [
  body('title', 'Title should contain minimum 3 symbols').isLength({ min: 3 }).trim(),
  body('price', 'Enter valid price').isNumeric(),
  body('img', 'Enter correct image url').isURL()
]
