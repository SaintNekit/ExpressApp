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
  const data = new Data(req.body.title, req.body.price, req.body.img);
  await data.save();
  res.redirect('/info')
})

module.exports = router;
