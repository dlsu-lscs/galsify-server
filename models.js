const mongoose = require('./db');

const userEvent = mongoose.Schema({
  name: String,
  owner_id: String,
  id_key: String,
  data: []
});

const userEventModel = mongoose.model('user_events', userEvent);

const user = mongoose.Schema({
  firstName: String,
  lastName: String,
  orgAffiliation: String,
  email: String,
  password: String,
})

const userModel = mongoose.model('user', user);

module.exports = { userEventModel, userModel }
