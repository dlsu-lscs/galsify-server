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

const userEvents = require('./controllers/userEvents')
app.use('/event', userEvents);

const auth = require('./controllers/auth')
app.use('/auth', auth);

app.listen(process.env.PORT || 3000, () => {
  console.log(`[GALZify] Server started. Listening on port ${process.env.PORT || 3000}`);
});

//potngina mo potangin mo potangina mo potangina mo potangina mo poangina mo potangina mo potangina mo potangina mo otangina mo potagnina mo potangina potangina mo potangina potnagina potangina mo potangina mo potangina mo potangina mpo potangin mo potangina mo potanina mo potangina mo potangina mo potangina mo potangian mo po tangina mo potangina mo potangina mo potangina mo otangina mo potangina mo potangina mo otangina mo potangina mo potangina mo potangina mo potangina mo potangina mo potangina mo potangina mo potangina mo potangina mo potangina mo potangina mo potangian mao potangina mo potangina mo potangina mo potangina mo optangina mo potangian mo potangina mo potangina mo potangina mo potangina mo optangina mo potangina mo potangina mo otangina mo potangina mop otangina mpotangina mo potangina mo potangina mop op mo potangian mop potangina mo otangina mop otangina mo potangin mo potngina mo optangia o 
