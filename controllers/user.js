const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const userModels = require('../models');
const userAuthMiddleware = require('../middleware/userAuth');

const userModel = userModels.userModel;
const userEventModel = userModels.userEventModel;
const userAuth = userAuthMiddleware.userAuth;

router.post('/', userAuth, async (req, res) => {
  if (req.body.id == null)
    return res.send({ status: 'error', error: "'id' field is empty." });

  if (req.body.eventid == null)
    return res.send({ status: 'error', error: "'eventid' field is empty." });

  const event = await userEventModel.findOne({ id: req.body.eventid }).exec();
});

// Create User
router.post('/create', async (req, res) => {
  try {
    const { email, name, password, orgs } = req.body;
    if (!email || !email.endsWith('@dlsu.edu.ph')) {
      return res.status(400).send({ status: 'error', error: 'Invalid email address.' });
    }
    if (!password) {
      return res.status(400).send({ status: 'error', error: 'Password is required.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email,
      name,
      password: hashedPassword,
      orgs,
      created_at: new Date().toISOString(),
      last_login: null
    });
    await newUser.save();
    res.status(201).send({ status: 'success', user: newUser });
  } catch (error) {
    res.status(500).send({ status: 'error', error: error.message });
  }
});

// Read User
router.get('/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ status: 'error', error: 'User not found.' });
    }
    res.status(200).send({ status: 'success', user });
  } catch (error) {
    res.status(500).send({ status: 'error', error: error.message });
  }
});

// Update User
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await userModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!user) {
      return res.status(404).send({ status: 'error', error: 'User not found.' });
    }
    res.status(200).send({ status: 'success', user });
  } catch (error) {
    res.status(500).send({ status: 'error', error: error.message });
  }
});

// Delete User
router.delete('/:id', async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ status: 'error', error: 'User not found.' });
    }
    res.status(200).send({ status: 'success', message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).send({ status: 'error', error: error.message });
  }
});

module.exports = router;