const { Router } = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');

const router = Router();

router.get('/', auth, async (req, res, ) => {
  res.render('profile', {
    title: 'Profile',
    isProfile: true,
    data: req.user.toObject()
  })
});

router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const newUser = {
      name: req.body.name
    };
    console.log(req.file)
    if (req.file) {
      newUser.avatarUrl = req.file.path;
    }

    Object.assign(user, newUser);
    await user.save();
    res.redirect('/profile');
  }
  catch (err) {
    console.log(err)
  }
})

module.exports = router;
