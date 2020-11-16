const { Router } = require('express');

const router = Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Home page',
    isHome: true
  })
})

module.exports = router;
