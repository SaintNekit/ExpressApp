const { Router } = require('express');
const bcrypt = require('bcryptjs');
const router = Router();
const User = require('../models/user');

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Login page',
    isLogin: true,
    registerError: req.flash('registerError'),
    loginError: req.flash('loginError')
  })
});

router.get('/logout', async (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login#login'))
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const pass = await bcrypt.compare(password, user.password);
      if (pass) {
        req.session.user = user;
        req.session.authStatus = true;
        req.session.save(err => {
          if (err) {
            throw err;
          }
          res.redirect('/');
        })
      }
      else {
        req.flash('loginError', 'Incorect password');
        res.redirect('/auth/login#login');
      }
    }
    else {
      req.flash('loginError', 'Incorect email');
      res.redirect('/auth/login#login');
    }
  }
  catch (err) {
    console.log(err)
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirm } = req.body;
    const registeredUser = await User.findOne({ email });
    if (registeredUser) {
      req.flash('registerError', 'email exist');
      res.redirect('/auth/login#register');
    }
    else {
      const cryptPass = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: cryptPass, cart: { data: [] } });
      await user.save();
      res.redirect('/auth/login#login')
    }
  }
  catch (err) {
    console.log(err)
  }
})

module.exports = router;
