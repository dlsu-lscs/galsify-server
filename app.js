require('dotenv').config();
const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60
  }
}));

const users = require('./controllers/user')
app.use('/users', users);

const userEvents = require('./controllers/userEvents')
app.use('/event', userEvents);

const auth = require('./controllers/auth')
app.use('/auth', auth);

app.listen(process.env.PORT || 3000, () => {
  console.log(`[GALZify] Server started. Listening on port ${process.env.PORT || 3000}`);
});
