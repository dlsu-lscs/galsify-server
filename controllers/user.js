const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { userModel, userEventModel } = require('../models');
const userAuth = require('../middleware/userAuth');

router.post('/', userAuth, async (req, res) => {
  if (req.body.id == null)
    return res.send({ status: 'error', error: "'id' field is empty." });

  if (req.body.eventid == null)
    return res.send({ status: 'error', error: "'eventid' field is empty." });

  const event = await userEventModel.findOne({ id: req.body.eventid }).exec();

});
