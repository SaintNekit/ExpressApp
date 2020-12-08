const { Router } = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const mailjet = require('node-mailjet').connect(process.env.MAIL_API_KEY, process.env.MAIL_SECRET_KEY);
const User = require('../models/user');
const welcom = require('../emails/welcom');
const recovery = require('../emails/recovery');
const { registerValidators, loginValidators } = require('../utils/validators.js');

const router = Router();

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Login page',
    isLogin: true,
    registerError: req.flash('registerError'),
    loginError: req.flash('loginError'),
    loginSuccess: req.flash('loginSuccess')
  })
});

router.get('/recovery', async (req, res) => {
  res.render('auth/recovery', {
    title: 'Password recovery',
    error: req.flash('error')
  })
});

router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    res.redirect('/auth/login');
  }
  try {
    const user = await User.findOne({
      token: req.params.token,
      tokenExp: { $gt: Date.now() }
    });
    if (!user) {
      res.redirect('/auth/login');
    }
    else {
      res.render('auth/password', {
        title: 'New password',
        error: req.flash('error'),
        token: user.token,
        userId: user._id.toString()
      })
    }
  }
  catch (err) {
    console.log(err);
  }
});

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      token: req.body.token,
      tokenExp: { $gt: Date.now() }
    })
    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10);
      user.token = undefined;
      user.tokenExp = undefined;
      await user.save();
      req.flash('loginSuccess', 'Password was successfuly changed');
      res.redirect('/auth/login');
    }
    else {
      req.flash('loginError', 'Token was expired');
      res.redirect('/auth/login');
    }
  }
  catch (err) {
    console.log(err)
  }
})

router.post('/recovery', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Something went wrong, try again later...');
        return res.redirect('/auth/recovery');
      }
      const token = buffer.toString('hex');
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.token = token;
        user.tokenExp = Date.now() + 3600 * 1000;
        await user.save();
        await mailjet.post("send", { 'version': 'v3.1' }).request(recovery(user.email, user.name, token));
        req.flash('loginSuccess', 'Mail was sent');
        res.redirect('/auth/login')
      }
      else {
        req.flash('error', 'No user with such email');
        return res.redirect('/auth/recovery');
      }
    })
  }
  catch (err) {
    console.log(err)
  }
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => res.redirect('/auth/login#login'))
})

router.post('/login', loginValidators, async (req, res) => {
  try {
    const { email, password } = req.body;
    const error = validationResult(req);
    const user = await User.findOne({ email });

    if (!error.isEmpty()) {
      req.flash('loginError', error.array()[0].msg);
      return res.status(422).redirect('/auth/login#login');
    }
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

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const error = validationResult(req);
    if (!error.isEmpty()) {
      req.flash('registerError', error.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }

    const cryptPass = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: cryptPass, cart: { data: [] } });
    await user.save();
    res.redirect('/auth/login#login');
    req.flash('loginSuccess', 'Accaunt was successfuly registered');
    await mailjet.post("send", { 'version': 'v3.1' }).request(welcom(email, name));
  }
  catch (err) {
    console.log(err)
  }
})

module.exports = router;
