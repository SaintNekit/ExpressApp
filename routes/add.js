const { Router } = require('express');
const Data = require('../models/data');

const router = Router();

router.get('/', (req, res, next) => {
  res.render('add', {
    title: 'Add page',
    isAdd: true
  })
});

router.post('/', async (req, res) => {
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
