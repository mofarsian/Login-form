const express = require('express');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  console.log(req.body);
  res.send('Done');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', (req, res) => {
  console.log(req.body);
  res.send('Done');
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
