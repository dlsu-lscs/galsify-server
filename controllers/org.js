const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { orgModel } = require('../models');

router.get('/:key', async (req, res) => {

  if (req.query.key == undefined)
    return res.send({ status: 'error', message: 'Could not detect organization key in query.' })

  const org = await orgModel.findOne({ key: req.query.key }).exec();

  if (org == undefined)
    return res.send({ status: 'error', message: 'org not found.' });

  return res.send({ status: 'ok', org: org });
});

router.post('/create', validateKey.admin, (req, res) => {
  const org = req.body;
  let errors = [];

  if (org.name == undefined) errors.push("NULL_NAME");
  if (org.key == undefined) errors.push("NULL_KEY");
  if (org.type == undefined) errors.push("NULL_TYPE");

  if (errors.length > 0) return res.send({ status: 'error', error: errors });

  const newOrg = new orgModel({
    name: org.name,
    key: org.key,
    type: org.type,
    description: org.description,
    founding_date: org.founding_date,
    enabled: org.enabled
  });

  newOrg.save()
    .then(savedOrg => {
      console.log('New organization saved:', savedOrg);
      return res.send({ status: 'ok', organization: savedOrg });
    })
    .catch(error => {
      console.error('Error saving organization:', error);
      return res.send({ status: 'error', error: error });
    });
});

router.post('/update', validateKey.admin, async (req, res) => {
  const org = req.body;
  const updateFields = {};

  if (org.id == undefined) return res.send({ status: 'error', error: 'No organization id defined.' });
  if (org.name != undefined) updateFields.name = org.name;

  if (Object.keys(updateFields).length < 1) return res.send({ status: 'error', error: "No keys to update defined." });

  orgModel.updateOne({ _id: org.id }, { $set: updateFields })
    .then(result => {
      return res.send({ status: 'ok', data: result });
    })
    .catch(err => {
      return res.send({ status: 'error', error: err });
    });
});

router.post('/delete', validateKey.admin, async (req, res) => {
  const org = req.body;

  if (org.id == undefined) return res.send({ status: 'error', error: 'No organization id defined.' });

  try {
    const result = await orgModel.findOne({ _id: org.id });
    if (!result) {
      return res.send({ status: 'error', error: 'Organization not found.' });
    }

    await orgModel.deleteOne({ _id: result._id });
    res.send({ status: 'ok', deleted: result });
  } catch (err) {
    return res.send({ status: 'error', error: err.message });
  }
});


router.post('/list', async (req, res) => {

  let searchQuery = {};
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
  }

  if (req.body.search_by != null) {
    searchQuery[req.body.search_by ?? "name"] = { $regex: req.body.search, $options: 'i' };
  }

  const result = await orgModel.paginate(searchQuery, options);

  return res.send({ status: 'ok', ...result })
})
