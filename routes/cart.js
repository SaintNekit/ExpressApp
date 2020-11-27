const { Router } = require('express');
const authRotes = require('../middleware/authRotes');
const Data = require('../models/data');
const router = Router();

const totalPrice = (data) => {
  return data.reduce((price, el) => {
    return price += +el.price * el.count
  }, 0)
}

router.get('/', authRotes, async (req, res) => {
  try {
    const user = await req.user.populate('cart.data.dataId').execPopulate();
    const data = user.cart.data.map(el => ({ ...el.dataId._doc, id: el.dataId.id, count: el.count }));

    res.render('cart', {
      title: 'Cart',
      isCart: true,
      data: data,
      totalPrice: totalPrice(data)
    })
  }
  catch (err) {
    console.log(err)
  }
})

router.delete('/delete/:id', authRotes, async (req, res) => {
  try {
    await req.user.deleteItem(req.params.id);
    const user = await req.user.populate('cart.data.dataId').execPopulate();
    const data = user.cart.data.map(el => ({ ...el.dataId._doc, id: el.dataId.id, count: el.count }));
    const cart = {
      data,
      totalPrice: totalPrice(data)
    }
    res.status(200).json(cart);
  }
  catch (err) {
    console.log(err)
  }
})

router.post('/add', authRotes, async (req, res) => {
  const data = await Data.findById(req.body.id);
  await req.user.addData(data);

  res.redirect('/cart');
})

module.exports = router;
