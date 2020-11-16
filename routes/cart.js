const { Router } = require('express');
const Data = require('../models/data');
const Cart = require('../models/cart');
const router = Router();

router.get('/', async (req, res) => {
  const data = await Cart.get();
  res.render('cart', {
    title: 'Cart',
    isCart: true,
    data
    // items: data.items,
    // totalPrice: data.totalPrice
  })
})

router.delete('/delete/:id', async (req, res) => {
  const cart = await Cart.delete(req.params.id);
  res.status(200).json(cart);
})

router.post('/add', async (req, res) => {
  const data = await Data.getById(req.body.id);
  await Cart.add(data);

  res.redirect('/cart');
})

module.exports = router;
