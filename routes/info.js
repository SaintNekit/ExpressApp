const { Router } = require('express');
const Data = require('../models/data');

const router = Router();

router.get('/', async (req, res, next) => {
  const data = await Data.getData();
  res.render('info', {
    title: 'Info page',
    isInfo: true,
    data
  })
});

router.get('/:id/edit', async (req, res) => {
  !req.query.allow && res.redirect('/');

  const data = await Data.getById(req.params.id);

  res.render('edit', {
    title: `Edit ${data.title}`,
    data
  })
})

router.post("/edit", async (req, res) => {
  await Data.update(req.body);

  res.redirect('/info')
})

router.get('/:id', async (req, res) => {
  const data = await Data.getById(req.params.id);
  res.render('data', {
    layout: 'empty',
    title: `View data ${data.title}`,
    data
  });
})



module.exports = router;
