const { Router } = require('express');
const bcrypt = require('bcryptjs');
const mailjet = require('node-mailjet').connect(process.env.MAIL_API_KEY, process.env.MAIL_SECRET_KEY);
const User = require('../models/user');

const router = Router();

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
      res.redirect('/auth/login#login');

      await mailjet.post("send", { 'version': 'v3.1' }).request({
        "Messages": [
          {
            "From": {
              "Email": "stepanovn2706@gmail.com",
              "Name": "Saint"
            },
            "To": [
              {
                "Email": `${email}`,
                "Name": `${name}`
              }
            ],
            "Subject": "Greetings from Saint shop.",
            "TextPart": "Account was registered",
            "HTMLPart": `<h3>Dear passenger 1, welcome to <a href='${process.env.BASE_URL}'>Saint shop</a>!</h3><br /> Your account ${email} was successfuly registered<br />May the delivery force be with you!`,
            "CustomID": "AppGettingStartedTest"
          }
        ]
      })
    }
  }
  catch (err) {
    console.log(err)
  }
})

module.exports = router;
