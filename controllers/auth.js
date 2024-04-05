const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { userModel } = require('../models');
const userAuth = require('../middleware/userAuth');

router.post('/login', async (req, res) => {
  if (req.body.username == null || req.body.password == null)
    return res.send({ status: 'error', error: 'Your username or password cannot be empty.' });

  const loginData = await userModel.findOne({ email: req.body.username }).exec();

  if (loginData == undefined)
    return res.send({ status: 'error', error: 'Username not found. Please try again.' });

  const passwordMatch = await bcrypt.compare(req.body.password, loginData.password);

  if (!passwordMatch) return res.send({ status: 'error', error: 'Incorrect password. Please try again.' });

  const token = jwt.sign({ user_id: loginData._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
  return res.send({ status: 'success', token: token });
});

router.post('/signup', async (req, res) => {
  let errors = [];

  if (req.body.email == null) errors.push('NULL_EMAIL')
  else if (!req.body.email.includes('@dlsu.edu.ph'))
    errors.push('NOT_DLSU_EMAIL')

  if (req.body.password == null) errors.push('NULL_PASSWORD')

  if (errors.length > 0) return res.send({ status: 'error', errors: errors });

  const usernameExists = await userModel.findOne({ email: req.body.email }).exec();
  if (usernameExists != undefined)
    return res.send({ status: 'error', error: 'Email already in use. Please select a different one.' })

  const passwordHash = await bcrypt.hash(req.body.password, 10);
  const newUser = userModel({
    email: req.body.email,
    password: passwordHash
  });

  await newUser.save().then((user, err) => {
    if (err) return res.send({ status: 'error', error: err });

    const token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    return res.send({ status: 'success', token: token });
  });
})

module.exports = router;
