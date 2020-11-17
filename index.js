const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const homeRoute = require('./routes/home');
const infoRoute = require('./routes/info');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
// app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use('/', homeRoute);
app.use('/info', infoRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);


const PORT = process.env.PORT || 3000;

const start = async () => {
  try {

    const url = `mongodb+srv://SaintNekit:${env.parsed.PASS}@cluster0.hiuof.mongodb.net/testDB?retryWrites=true&w=majority`;

    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    app.listen(PORT, () => {
      console.log(`Server run on port ${PORT}`)
    })
  }
  catch (err) {
    console.log(err)
  }
};

start();
