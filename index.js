const env = require('dotenv').config();
const express = require('express');
const path = require('path');
const csurf = require('csurf');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
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
const page404 = require('./middleware/404');
const profileRoute = require('./routes/profile');
const fileMiddleware = require('./middleware/file');

const MONGO_URI = process.env.MONGO_URI;

const app = express();
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./utils/hbs-helpers'),
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});
const store = new MongoStore({
  collection: 'sessions',
  uri: MONGO_URI
})

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/avatars', express.static(path.join(__dirname, 'avatars')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET_TOKEN,
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csurf());
app.use(flash());
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(middleware);
app.use(userMiddleware);

app.use('/', homeRoute);
app.use('/info', infoRoute);
app.use('/add', addRoute);
app.use('/cart', cartRoute);
app.use('/orders', orderRoute);
app.use('/auth', authRoute);
app.use('/profile', profileRoute);

app.use(page404);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
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
