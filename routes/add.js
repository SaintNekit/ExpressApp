const { Router } = require('express');
const auth = require('../middleware/auth');
const Data = require('../models/data');
const { validationResult } = require('express-validator');
const { addValidators } = require('../utils/validators');

const router = Router();

router.get('/', auth, (req, res, next) => {
  res.render('add', {
    title: 'Add page',
    isAdd: true
  })
});

router.post('/', auth, addValidators, async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add page',
      isAdd: true,
      error: error.array()[0].msg,
      data: {
        title: req.body.title,
        price: req.body.price,
        img: req.body.img,
      }
    });
  }

  const data = new Data({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user
  });

  try {
    await data.save();
    res.redirect('/info');
  }
  catch (err) {
    console.log(err);
  }
})

module.exports = router;
