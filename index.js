const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const homeRoute = require('./routes/home');
const infoRoute = require('./routes/info');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/orders');
const User = require('./models/user');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
// app.set('views', 'views');

app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5fb51100ffac1a3a098a3b09');
    req.user = user;
    next();
  }
  catch (err) {
    console.log(err);
  }
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use('/', homeRoute);
app.use('/info', infoRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);
app.use('/orders', orderRoute);


const PORT = process.env.PORT || 3000;

const PASS = env.parsed.PASS;

const start = async () => {
  try {
    const url = `mongodb+srv://SaintNekit:${PASS}@cluster0.hiuof.mongodb.net/testDB?retryWrites=true&w=majority`;

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const user = await User.findOne();
    if (!user) {
      const user = new User({
        name: 'SaintNekit',
        email: 'gulivon@mail.ru',
        password: 'test',
        cart: { data: [] }
      });
      await user.save();
    }

    app.listen(PORT, () => {
      console.log(`Server run on port ${PORT}`)
    })
  }
  catch (err) {
    console.log(err)
  }
};

start();
