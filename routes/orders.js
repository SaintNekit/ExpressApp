const { Router } = require('express');
const Order = require('../models/order');
const router = Router();

router.get('/', async (req, res) => {
  try {
    const data = await Order.find({ 'user.userId': req.user._id }).populate('user.userId');

    res.render('orders', {
      title: 'Orders',
      isOrders: true,
      data: data.map(el => {
        return {
          ...el._doc,
          totalPrice: el.data.reduce((total, i) => {
            return total += i.count * +i.item.price
          }, 0)
        }
      })
    })
  }
  catch (err) {
    console.log(err);
  }

});

router.post('/', async (req, res) => {
  try {
    const user = await req.user.populate('cart.data.dataId').execPopulate();
    const data = user.cart.data.map(el => ({ item: { ...el.dataId._doc }, count: el.count }));
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },
      data
    });
    await order.save();
    await req.user.clearCart();
    res.redirect('/orders')
  }
  catch (err) {
    console.log(err)
  }
})

module.exports = router;
