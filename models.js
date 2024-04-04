const mongoose = require('./db.js');

const userEvent = mongoose.Schema({
  name: String,
  owner_id: String,
  id_key: String,
  data: []
});

const userEventModel = mongoose.model('user_events', userEvent);

module.exports = { userEventModel }
