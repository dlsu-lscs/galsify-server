const mongoose = require('./db');

const userEvent = mongoose.Schema({
  name: String,
  owner_id: String,
  id_key: String,
  data: []
});

const userEventModel = mongoose.model('user_events', userEvent);

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /@dlsu\.edu\.ph$/
  },
  name: {
    first: String,
    last: String
  },
  password: {
    type: String,
    required: true
  },
  orgs: [
    {
      org_id: mongoose.Schema.Types.ObjectId,
      org_name: String,
      permissions: [String]
    }
  ],
  created_at: String,
  last_login: String
});

const userModel = mongoose.model('user', userSchema);

module.exports = { userEventModel, userModel }
