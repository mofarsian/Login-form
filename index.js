require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const { nanoid } = require('nanoid');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const initilaizePassport = require('./passport-config');
const {
  checkAuthenticated,
  checkNotAuthenticated,
} = require('./middleware/auth');

const users = [];

initilaizePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id),
);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', checkAuthenticated, (req, res) => {
  res.render('index', { username: req.user.username });
});

app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login');
});

app.post(
  '/login',
  checkNotAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  }),
);

app.get('/signup', checkNotAuthenticated, (req, res) => {
  res.render('signup');
});

app.post('/signup', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: nanoid(),
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    res.redirect('/login');
  } catch (error) {
    console.log(error);
  }
});

app.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/login');
});

app.listen(3000, () => {
  console.log('Running on port 3000');
});
