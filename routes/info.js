const { Router } = require('express');
const authRotes = require('../middleware/authRotes');
const Data = require('../models/data');

const router = Router();

router.get('/', async (req, res, next) => {
  const data = await Data.find().lean().populate('userId', 'name email');
  res.render('info', {
    title: 'Info page',
    isInfo: true,
    data
  })
});

router.get('/:id/edit', authRotes, async (req, res) => {
  !req.query.allow && res.redirect('/');
  const data = await Data.findById(req.params.id).lean();

  res.render('edit', {
    title: `Edit ${data.title}`,
    data
  })
});

router.post("/delete", authRotes, async (req, res) => {
  await Data.deleteOne({ _id: req.body.id });

  res.redirect("/info");
})

router.post("/edit", authRotes, async (req, res) => {
  const { id } = req.body;
  delete req.body.id;
  await Data.findByIdAndUpdate(id, req.body).lean();

  res.redirect('/info')
})

router.get('/:id', async (req, res) => {
  const data = await Data.findById(req.params.id).lean();
  res.render('data', {
    layout: 'empty',
    title: `View data ${data.title}`,
    data
  });
})



module.exports = router;
