const { Router } = require('express');
const { validationResult } = require('express-validator');
const { addValidators } = require('../utils/validators');
const auth = require('../middleware/auth');
const Data = require('../models/data');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const data = await Data.find().lean().populate('userId', 'name email');
    res.render('info', {
      title: 'Info page',
      isInfo: true,
      userId: req.user ? req.user._id.toString() : null,
      data
    })
  }
  catch (err) {
    console.log(err)
  }
});

router.get('/:id/edit', auth, async (req, res) => {
  !req.query.allow && res.redirect('/');
  try {
    const data = await Data.findById(req.params.id).lean();

    data.userId.toString() !== req.user._id.toString() && res.redirect('/info');

    res.render('edit', {
      title: `Edit ${data.title}`,
      data,
      error: req.flash('error'),
    })
  }
  catch (err) {
    console.log(err)
  }
});

router.post("/delete", auth, async (req, res) => {
  await Data.deleteOne({ _id: req.body.id, userId: req.user._id });

  res.redirect("/info");
})

router.post("/edit", auth, addValidators, async (req, res) => {
  const { id } = req.body;
  const error = validationResult(req);

  if (!error.isEmpty()) {
    req.flash('error', error.array()[0].msg);
    res.status(422).redirect(`/info/${id}/edit?allow=true`);
  }

  try {
    delete req.body.id;
    await Data.findByIdAndUpdate(id, req.body).lean();

    res.redirect('/info')
  }
  catch (err) {
    console.log(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const data = await Data.findById(req.params.id).lean();
    res.render('data', {
      layout: 'empty',
      title: `View data ${data.title}`,
      data
    });
  }
  catch (err) {
    console.log(err)
  }
})

module.exports = router;
