require('dotenv').config();
const express = require('express');
const app = express();

const userEvents = require('./controllers/userEvents')
app.use('/event', userEvents);

app.listen(process.env.PORT || 3000, () => {
  console.log(`[GALZify] Server started. Listening on port ${process.env.PORT || 3000}`);
});

