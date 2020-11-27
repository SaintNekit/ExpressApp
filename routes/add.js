const { Router } = require('express');
const authRotes = require('../middleware/authRotes');
const Data = require('../models/data');

const router = Router();

router.get('/', authRotes, (req, res, next) => {
  res.render('add', {
    title: 'Add page',
    isAdd: true
  })
});

router.post('/', authRotes, async (req, res) => {
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
