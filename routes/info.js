const { Router } = require('express');
const authRotes = require('../middleware/authRotes');
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

router.get('/:id/edit', authRotes, async (req, res) => {
  !req.query.allow && res.redirect('/');
  try {
    const data = await Data.findById(req.params.id).lean();

    data.userId.toString() !== req.user._id.toString() && res.redirect('/info');

    res.render('edit', {
      title: `Edit ${data.title}`,
      data
    })
  }
  catch (err) {
    console.log(err)
  }
});

router.post("/delete", authRotes, async (req, res) => {
  await Data.deleteOne({ _id: req.body.id, userId: req.user._id });

  res.redirect("/info");
})

router.post("/edit", authRotes, async (req, res) => {
  try {
    const { id } = req.body;
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
