const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const csurf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const homeRoute = require('./routes/home');
const infoRoute = require('./routes/info');
const addRoute = require('./routes/add');
const cartRoute = require('./routes/cart');
const orderRoute = require('./routes/orders');
const authRoute = require('./routes/auth');
const middleware = require('./middleware/validate');
const userMiddleware = require('./middleware/user');


const PASS = process.env.PASS;
const MONGODB_URI = `mongodb+srv://SaintNekit:${PASS}@cluster0.hiuof.mongodb.net/testDB?retryWrites=true&w=majority`;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers'),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});
const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'Token',
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(csurf());
app.use(flash());
app.use(middleware);
app.use(userMiddleware);

app.use('/', homeRoute);
app.use('/info', infoRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);
app.use('/orders', orderRoute);
app.use('/auth', authRoute);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
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
