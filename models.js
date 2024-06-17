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

const organization = mongoose.Schema({
  name: String,
  key: String,
  type: String,
  description: String,
  founding_date: String,
  enabled: Boolean
})

const orgModel = mongoose.model('orgs', organization);

module.exports = { userEventModel, userModel, orgModel }
